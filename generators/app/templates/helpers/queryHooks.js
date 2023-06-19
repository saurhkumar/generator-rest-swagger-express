module.exports = {
  mapping: mapping
};
/**
 *
 * returns mappings
 * sortFields : contains all the fields sort is allowed
 * queryFields : contains all the fields query filter is allowed
 *              allowed type are string, int, boolean, decimal and there are case senstive
 */
function mapping() {
  return {
    sortFields: ['name', 'age', 'address', 'country', 'createdAt'], // all the allowed fields for which sorting is valid
    queryFields: [
      // all the allowed fields for which filter is allowed
      { name: 'name', type: 'string' },
      { name: 'age', type: 'int' },
      { name: 'address', type: 'string' },
      { name: 'createdAt', type: 'date' },
      { name: 'isActive', type: 'boolean' },
      { name: 'country', type: 'string' }
    ],
    virtuals: [
      // TODO: Implement logic for this in the parser
      {
        sourceField: 'id',
        targetField: '_id',
        valueTransformer: (value) => {
          // to apply any transformation on the actual value, or even calling any external routine to augment the value
          return value;
        }
      }
    ]
  };
}
