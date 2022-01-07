const model = require('../model/model');
module.exports = {
  get<%= objectName %>: get<%= objectName %>,
  create<%= objectName %>: create<%= objectName %>,
  update<%= objectName %>: update<%= objectName %>,
  delete<%= objectName %>: delete<%= objectName %>,
  get<%= objectName %>s: get<%= objectName %>s,
  delete<%= objectName %>s: delete<%= objectName %>s
};

async function get<%= objectName %>(id) {
  return await model.get<%= objectName %>(id);
}

async function create<%= objectName %>(<%= objectName %>) {
  return await model.create<%= objectName %>(<%= objectName %>);
}

async function update<%= objectName %>(id, <%= objectName %>) {
  return await model.update<%= objectName %>(id, <%= objectName %>);
}
async function delete<%= objectName %>(id) {
  return await model.delete<%= objectName %>(id);
}

async function get<%= objectName %>s(top, skip) {
  return await model.get<%= objectName %>s(top, skip);
}

async function delete<%= objectName %>s() {
  return await model.delete<%= objectName %>s();
}
