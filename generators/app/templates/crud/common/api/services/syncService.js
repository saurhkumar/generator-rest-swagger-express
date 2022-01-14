/**
 * Any service/process want's to run before app start
 */
const model = require('../models/model');

module.exports = {
  start: start,
  stop: stop
};
async function start() {
  await model.start();
}
async function stop() {
  await model.close();
}
