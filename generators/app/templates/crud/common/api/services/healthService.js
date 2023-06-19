const logger = require('../../logger');
const healthModel = require('../models/healthModel');

module.exports = {
  getLive: getLive,
  getReady: getReady,
  clearHealthComponents: clearHealthComponents
};

let healthComponents = null;
function lazyLoadHealthComponents() {
  if (healthComponents == null) {
    healthComponents = healthModel.getComponents();
  }
  return healthComponents;
}

async function getLive() {
  const healthComponents = lazyLoadHealthComponents();
  const liveComponents = healthComponents.getLiveComponents();
  if (liveComponents.length == 0) {
    return true;
  }
  let promises = [];
  for (let liveService of liveComponents) {
    promises.push(liveService[1]()); // first is service name, second is the promise
  }
  let result = false;
  try {
    const livenessValues = await Promise.all(promises); // fail fast behaviour
    if (livenessValues.every((liveValue) => liveValue === true)) {
      result = true;
    }
  } catch (error) {
    logger.error(`getLive: Error in liveness:`, error);
  }
  return result;
}

async function getReady() {
  const healthComponents = lazyLoadHealthComponents();
  const readyComponents = healthComponents.getReadyComponents();

  let result = {
    status: 'App is healthy',
    components: [],
    isHealthy: true
  };

  if (readyComponents.length == 0) {
    return result;
  }
  let promises = [];
  for (let readyService of readyComponents) {
    promises.push(readyService[1]()); // fucntion call
  }
  try {
    const healtCompResults = await Promise.allSettled(promises); // get result of each promise
    for (const [index, promiseResp] of healtCompResults.entries()) {
      if (!promiseResp.value.status) {
        result.isHealthy = false;
        result.status = 'App is not healthy';
      }
      result.components.push({
        // all helper should handel the error properly, and should not throw error
        status: promiseResp.value.status, // true or false
        message: promiseResp.value.message,
        name: readyComponents[index].name // service name
      });
    }
  } catch (error) {
    // just for fail check, it should not come to catch block
    logger.error(`getLive: Error in liveness:`, error);
  }
  return result;
}

// This function is just for testing
function clearHealthComponents() {
  healthComponents = null;
}
