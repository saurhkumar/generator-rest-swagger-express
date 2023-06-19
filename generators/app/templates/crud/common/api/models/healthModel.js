// for live and readiness probe
const dbHelper = require('../helpers/mongoHelper');
const components = [
  {
    name: 'mongoDB',
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
