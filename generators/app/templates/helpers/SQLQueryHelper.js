const logger = require('../../logger')(__filename);

const queryHooks = require('./queryHooks');
const filter = require('./sqlFilter');
const allowedSortFields = new Set(queryHooks.mapping().sortFields);
const queryFields = queryHooks
  .mapping()
  .queryFields.map((queryField) => queryField.name);
const queryFieldsSet = new Set(queryFields);
module.exports = {
  transformSortBy: transformSQLSortBy,
  transformProjection: transformSQLProjection,
  transformFilterQuery: transformFilterQuery
};

function transformSQLSortBy(sortBy) {
  let sortFields = [];
  if (!sortBy) {
    return '';
  }
  sortBy
    .split(' ')
    .filter((field) => field) // remove addtional spaces, all the spaces will be false
    .forEach((field) => {
      const sortDirection = field.substring(0, 1);
      const sortfield = field.substring(1);
      if (sortDirection != '+' && sortDirection != '-') {
        throw {
          message: `${sortDirection} direction is not allowed. Bad request`,
          statusCode: 400
        };
      }

      if (!allowedSortFields.has(sortfield)) {
        throw {
          message: `${sortfield} is not allowed for the sorting. Bad request`,
          statusCode: 400
        };
      }
      const orderBy = sortDirection === '+' ? 'ASC' : 'DESC';
      sortFields.push(`${sortfield} ${orderBy}`);
    });
  return `ORDER BY ${sortFields.join(',')}`;
}

function transformSQLProjection(projection) {
  if (!projection) {
    return '*';
  }
  let sqlAddProjection = [];
  let allProjectionType = new Set();
  const projectionFields = [];
  const sqlRemoveProjection = new Set(queryFields); // deep copy
  projection
    .split(' ')
    .filter((field) => field) // remove addtional spaces, all the spaces will be false
    .forEach((field) => {
      const projectionType = field[0];
      const projectionField = field.substring(1);
      allProjectionType.add(projectionType);
      if (projectionType != '-' && projectionType != '+') {
        throw {
          message: `${projectionType} is not allowed. only '+' and '-' are allowed Bad request`,
          statusCode: 400
        };
      }
      if (!queryFieldsSet.has(projectionField)) {
        throw {
          message: `Random projections not allowed`,
          statusCode: 400
        };
      }

      if (projectionType === '+') {
        // need to keep this field in the SQL query
        sqlAddProjection.push(projectionField);
      } else {
        // need to remove this field in the SQL query
        sqlRemoveProjection.delete(projectionField);
      }
      projectionFields.push(projectionField);
    });
  // check if + and - are not mixed together
  if (allProjectionType.size > 1) {
    throw {
      message: `projection can not be mixed together, either use + or -`,
      statusCode: 400
    };
  }
  let sqlProjection = '';
  if (sqlAddProjection.length > 0) {
    if (!sqlAddProjection.includes('id')) {
      sqlAddProjection.push('id'); // add id always
    }
    sqlProjection = sqlAddProjection.join(',');
  } else {
    sqlProjection = Array.from(sqlRemoveProjection).join(',');
  }
  return sqlProjection;
}

function transformFilterQuery(query) {
  let transformedQuery = '';
  if (query) {
    try {
      transformedQuery = filter.parse(query);
    } catch (error) {
      const messaage = error.message || 'bad query';
      logger.error(
        `transformQuery: error while parsing query, error: ${messaage}`
      );
      throw { messaage: messaage, statusCode: 400 };
    }
    transformedQuery = `WHERE ${transformedQuery}`;
  }
  return transformedQuery;
}
