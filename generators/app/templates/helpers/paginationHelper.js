const querystring = require('querystring');

module.exports = {
  generatePaginationLinks: generatePaginationLinks
};

/**
 *
 * @param {*} url Encoded URL string
 * @param {*} totalDocs total number of docs
 * @returns links object
 */
function generatePaginationLinks(url, totalDocs) {
  const links = {
    first: {
      href: ''
    },
    last: {
      href: ''
    },
    previous: {
      href: ''
    },
    next: {
      href: ''
    }
  };
  const _makeURL = function (basePath, queryParamMap) {
    return `${basePath}?${querystring.stringify(queryParamMap)}`;
  };
  let [basePath, queryParam] = url.split('?');

  const queryParamMap = querystring.parse(queryParam);
  let queryParamMapFirst = queryParamMap;
  let queryParamMapLast = queryParamMap;
  let queryParamMapNext = queryParamMap;
  let queryParamMapPrevious = queryParamMap;

  const top = parseInt(queryParamMap['$top']);
  const skip = parseInt(queryParamMap['$skip']);

  // first
  queryParamMapFirst['$top'] = top;
  queryParamMapFirst['$skip'] = 0;
  links.first.href = _makeURL(basePath, queryParamMapFirst);

  // last
  let skipForLastLink = 0;
  let quotient = Math.floor(totalDocs / top);
  let remainder = totalDocs % top;
  if (remainder == 0) {
    skipForLastLink = (quotient - 1) * top;
  } else {
    skipForLastLink = quotient * top;
  }
  queryParamMapLast['$top'] = top;
  queryParamMapLast['$skip'] = skipForLastLink;
  links.last.href = _makeURL(basePath, queryParamMapLast);

  // next link
  queryParamMapNext['$top'] = top;
  queryParamMapNext['$skip'] = skip + top;
  links.next.href = _makeURL(basePath, queryParamMapNext);

  // previous
  queryParamMapPrevious['$top'] = top;
  let skipForPreviousLink = skip > top ? skip - top : 0; // for the first page
  queryParamMapPrevious['$skip'] = skipForPreviousLink;
  links.previous.href = _makeURL(basePath, queryParamMapPrevious);

  return links;
}
