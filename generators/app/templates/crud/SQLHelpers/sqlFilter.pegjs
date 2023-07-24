{
  // query hooks
  const queryHooks = require('./queryHooks.js');
  // check allowed fields and for every field do the mapping like convert string int in to proper int and so
  const queryMapping = queryHooks.mapping();
  const allowedFieldsMap = {};
  const virtuals = {};
  queryMapping.queryFields.forEach((element) => {
    allowedFieldsMap[element.name] = element.type;
  });
  queryMapping.virtuals.forEach((element) => {
    virtuals[element.sourceField] = element;
  });
  const allowedFields = Object.keys(allowedFieldsMap);
  const allowedDataTypes = Object.values(allowedFieldsMap);
  const validDataTypesArray = ['string', 'int', 'boolean', 'decimal', 'date'];
  const validDataTypes = new Set(validDataTypesArray);
  // check for the allowed types in queryHooks allowed type are string, int, boolean
  allowedDataTypes.forEach((element) => {
    if (!(element in validDataTypes)) {
      new Error(
        `Invalid allowed types: ${element}, allowed types are: ${validDataTypesArray}. Stopping server, fix queryhooks file`
      );
    }
  });

  function transformInteger(value) {
    const transformedValue = parseInt(value, 10);
    if (isNaN(transformedValue)) {
      throw {
        message: `${value} is of type int`
      };
    }
    return transformedValue;
  }

  function transformDecimal(value) {
    const transformedValue = parseFloat(value);
    if (isNaN(transformedValue)) {
      throw {
        message: `${value} is of type int`
      };
    }
    return transformedValue;
  }

  function transformBoolean(value) {
    if (value !== 'true' && value !== 'false') {
      throw {
        message: `${value} is of type boolean and it is neither true nor false`
      };
    }
    return value === 'true';
  }

  function transformDate(value) {
    let transformedValue = new Date(value).toISOString(); // sql needs iso string
    if (!isNaN(transformedValue)) {
      throw {
        message: `${value} is of type date, insert date in ISO format like: "<YYYY-mm-ddTHH:MM:ss>" or "<YYYY-mm-ddTHH:MM:ssZ>"`
      };
    }
    transformedValue = transformedValue.split("Z")[0].split("T").join(" "); // 2023-07-09T18:04:41.011Z => 2023-07-09 18:04:41.011
    // filed = 'name' operator = '=', value = 'saurabh' => field + operator + value => name=saureabh -- quotes are missing and that's why additional quotes added 
    return `'${transformedValue}'`;// added additional quotes
  }

  function checkAllowedField(field) {
    if (!(field in allowedFieldsMap)) {
      throw {
        message: `${field} is not allowed to query. ${allowedFields} are allowed fileds`
      };
    }
  }

  function transformValue(value, field) {
    checkAllowedField(field);
    const targetType = allowedFieldsMap[field];
    try {
      let transformField;
      switch (targetType) {
        case 'string':
          if (Array.isArray(value)) {
            transformField = value.map((element) => `'${element}'`);
          } else {
            transformField = `'${value}'`;
          }
          break;
        case 'int':
          if (Array.isArray(value)) {
            transformField = value.map((element) => transformInteger(element));
          } else {
            transformField = transformInteger(value);
          }
          break;
        case 'decimal':
          if (Array.isArray(value)) {
            transformField = value.map((element) => transformDecimal(element));
          } else {
            transformField = transformDecimal(value);
          }
          break;

        case 'boolean':
          if (Array.isArray(value)) {
            transformField = value.map((element) => {
              return transformBoolean(element);
            });
          } else {
            transformField = transformBoolean(value);
          }
          break;

        case 'date':
          if (Array.isArray(value)) {
            transformField = value.map((element) => transformDate(element));
          } else {
            transformField = transformDate(value);
          }
          break;

        default:
          throw {
            message: `${value} is of type unkown, it can be of the following: ${validDataTypesArray}`
          };
      }
      return transformField;
    } catch (error) {
      throw {
        message: error.message || error
      };
    }
  }

  // this is database specific functions, move these out of parser later
  function transformOperator(operator) {
    let transformedOperator;
    switch (operator) {
      case 'OR':
        transformedOperator = 'OR';
        break;
      case 'AND':
        transformedOperator = 'AND';
        break;
      case '=':
        transformedOperator = '=';
        break;
      case '!=':
        transformedOperator = '!=';
        break;
      case '>':
        transformedOperator = '>';
        break;
      case '>=':
        transformedOperator = '>=';
        break;
      case '<':
        transformedOperator = '<';
        break;
      case '<=':
        transformedOperator = '<=';
        break;
      case 'IN':
        transformedOperator = 'IN';
        break;
      case 'NOT IN':
        transformedOperator = 'NOT IN';
        break;

      default:
        break;
    }
    return transformedOperator;
  }

  function transformOperatorExpression2Query(value, field, operator) {
    let transformedValue = transformValue(value, field);
    const trandformedOperator = transformOperator(operator);
    const query = `${field} ${trandformedOperator} (${transformedValue})`;
    return query;
  }
  
  function transformBooleanExpression2Query(
    operator,
    leftExpression,
    rightExpression
  ) {
    const trandformedOperator = transformOperator(operator);
    const query = `(${leftExpression}) ${trandformedOperator} (${rightExpression})`;
    return query;
  }

}
// Top level rule is Expression
Expression
  = boolExpression:BooleanExpression { return boolExpression; }
  / comparison:Comparison { return comparison; }
  / inComparison:InComparison { return inComparison; }
  / subExpression:SubExpression { return subExpression; }


// A sub expression is just an expression wrapped in parentheses
SubExpression
  = _ "(" _ innards: Expression _ ")" _ { return innards; }

Comparison
  = field:Field _ operator:(allowedOp) _ value:Term {
      return transformOperatorExpression2Query(value, field, operator);
    }
    
InComparison
  = field:Field _ operator:(inOp)  _ "(" _ value:inTerm _ ")" {
      return transformOperatorExpression2Query(value, field, operator);
    }

BooleanExpression = AND / OR

// AND to take precendence over OR
AND
  = _ left:( OR / SubExpression / Comparison / InComparison ) _ andTerm _ right:( AND / OR / SubExpression / Comparison / InComparison) _ {
    return transformBooleanExpression2Query("AND", left, right);
  }

OR
  = _ left:( SubExpression / Comparison /InComparison ) _ orTerm _ right:( OR / SubExpression / Comparison / InComparison ) _ {
    return transformBooleanExpression2Query("OR", left, right);
  }

Field
  = value:$([0-9a-zA-Z.:\-]+) {
      return value;
    }
    
Term
  = value:$("'"[0-9a-zA-Z.:\-]+ "'") {
      return value.replaceAll("'","").trim();
    }
    
inTerm
  =  value:$(_ ("'"[0-9a-zA-Z.:\- ]+"'") _ ("," _ "'" _ [0-9a-zA-Z.:\- ]+"'")* _)  {
       return value.split(",").map(element => element.replaceAll("'","").trim());
    }

inOp = in / not_in

allowedOp = gtEql 
        / gt 
        / lessEql 
        / less 
        / ntEql 
        / eql

orTerm = "or" { return "OR"; }
        / "OR" 

andTerm = "and" { return "AND"; }
        / "AND" 

eql = "=" 
        / "eq" { return "="; }

gt = ">" 
        / "gt" { return ">" }

less = "<" 
        / "lt" { return "<"; }

gtEql = ">=" 
        / "gte" { return ">="; }

lessEql = "<=" 
        / "lte" { return "<="; }

ntEql = "!=" 
        / "ne" { return "!="; }

in = "in" { return "IN"; }
      / "IN"

not_in = "nin" { return "NOT IN"; }
    / "not in" { return "NOT IN"; }
    / "NOT IN" 

_ "whitespace"
  = [ \t\n\r]*