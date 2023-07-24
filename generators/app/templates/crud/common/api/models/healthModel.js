// for live and readiness probe
<% if (appBackend =="MongoDB") { %>
const dbHelper = require('../helpers/mongoHelper');
<% } else { %>
const dbHelper = require('../helpers/sqlHelper');
<% } %>

const components = [
  {
<% if (appBackend =="MongoDB") { %>
    name: 'mongoDB'
<% } else { %>
    name: 'sql-database'
<% } %>,
    live: dbHelper.live,
    ready: dbHelper.ready
  }
];
function getComponents() {
  let liveComponents = [];
  let readyComponents = [];
  for (let component of components) {
    if (component.live) {
      liveComponents.push([component.name, component.live]);
    }
    if (component.ready) {
      readyComponents.push([component.name, component.ready]);
    }
  }
  return {
    getLiveComponents: function () {
      return liveComponents;
    },
    getReadyComponents: function () {
      return readyComponents;
    }
  };
}
module.exports = {
  getComponents: getComponents
};
