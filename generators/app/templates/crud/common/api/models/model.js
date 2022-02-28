const memoryCacheModel = require('../models/memoryCacheModel');
const dbModel = require('../models/<%= dbModel %>');

module.exports = {
  get<%= objectName %>: get<%= objectName %>,
  create<%= objectName %>: create<%= objectName %>,
  update<%= objectName %>: update<%= objectName %>,
  delete<%= objectName %>: delete<%= objectName %>,
  get<%= objectName %>s: get<%= objectName %>s,
  delete<%= objectName %>s: delete<%= objectName %>s,
  start: dbModel.start,
  close: dbModel.close
};

async function get<%= objectName %>(id) {
  let result = memoryCacheModel.getObject(id);
  if (!result) {
    result = await dbModel.get<%= objectName %>(id);
    if (result) memoryCacheModel.createObject(id, dbModel.copy(result));
  }
  return result;
}

async function create<%= objectName %>(<%= objectNameLowerCase %>) {
  const result = await dbModel.create<%= objectName %>(<%= objectNameLowerCase %>);
  memoryCacheModel.createObject(result.get('id'), dbModel.copy(result));
  return result;
}

async function update<%= objectName %>(id, <%= objectNameLowerCase %>) {
  const result = await dbModel.update<%= objectName %>(id, <%= objectNameLowerCase %>);
  if (result) memoryCacheModel.updateObject(id, dbModel.copy(result));
  return result;
}

async function delete<%= objectName %>(id) {
  memoryCacheModel.deleteObject(id);
  return dbModel.delete<%= objectName %>(id);
}
async function get<%= objectName %>s(top, skip) {
  let result = dbModel.get<%= objectName %>s(top, skip);
  return result;
}

async function delete<%= objectName %>s() {
  memoryCacheModel.clear();
  return dbModel.delete<%= objectName %>s();
}
