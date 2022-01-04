/**
 * Any service/process want's to run before app start
 */

module.exports = {
  start: start,
  stop: stop
};

// any process need to trigger before app start
async function start() {}

// any process/connection that needed to be closed: for clean test close
async function stop() {}
