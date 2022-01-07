/**
 * Any service/process want's to run before app start
 */
const model = require('../model/model');

module.exports = {
  start: start,
  stop: stop
};
async function start() {
  // create table and constrain
  await model.start.sync();
}
async function stop() {
  await model.close();
}
