const LRUCache = require('lru-cache');
const config = require('config');

const myCache = new LRUCache({
  ttl: config.Caching.memory.msTTL,
  updateAgeOnHas: true,
  updateAgeOnGet: true,
  max: config.Caching.memory.maxKeys
});

module.exports = {
  getObject: getObject,
  createObject: createObject,
  deleteObject: deleteObject,
  updateObject: updateObject,
  clear: clear
};

function getObject(key) {
  return myCache.get(key); // undefine if miss
}

function createObject(key, value) {
  return myCache.set(key, value);
}

function deleteObject(key) {
  return myCache.delete(key);
}

function updateObject(key, value) {
  deleteObject(key);
  return createObject(key, value);
}

function clear() {
  myCache.clear();
}
