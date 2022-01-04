const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

function start() {
  // set a scope : blank object
  asyncLocalStorage.enterWith({});
}

function set(key, value) {
  let localObj = asyncLocalStorage.getStore();
  localObj[key] = value;
  asyncLocalStorage.enterWith(localObj);
}

function get(key) {
  return asyncLocalStorage.getStore()[key];
}

module.exports = {
  start: start,
  set: set,
  get: get
};
