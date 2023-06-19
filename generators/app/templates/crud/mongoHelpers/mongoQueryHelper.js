const queryHooks = require('../helpers/queryHooks');
const allowedSortFields = new Set(queryHooks.mapping().sortFields);

module.exports = {
  transformSortBy: transformMongoSortBy,
  transformProjection: transformMongoProjection
};

function transformMongoSortBy(sortBy) {
  let sortConfig = {};
  if (!sortBy) {
    return sortConfig;
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

      sortConfig[sortfield] = sortDirection === '+' ? 'asc' : 'desc';
    });
  return sortConfig;
}
function transformMongoProjection(projection) {
  if (!projection) {
    return '';
  }
  projection
    .split(' ')
    .filter((field) => field) // remove addtional spaces, all the spaces will be false
    .forEach((field) => {
      const projectionType = field.substring(0, 1);
      if (projectionType != '-') {
        throw {
          message: `${projectionType} is not allowed. only '-' is allowed Bad request`,
          statusCode: 400
        };
      }
    });
  return projection;
}
