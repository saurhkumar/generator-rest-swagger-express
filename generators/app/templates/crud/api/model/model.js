const logger = require('../../logger')(__filename);
const SQLHelper = require('../helpers/mysqlHelper');
const shortId = require('../helpers/shortId');
const <%= objectName %> = SQLHelper.sequelize.define(
  '<%= objectName %>',
  {
    id: {
      type: SQLHelper.dataTypes.STRING,
      primaryKey: true,
      defaultValue: shortId.generate
    },
    name: { type: SQLHelper.dataTypes.STRING, allowNull: false },
    age: { type: SQLHelper.dataTypes.SMALLINT, allowNull: false },
    address: { type: SQLHelper.dataTypes.STRING, allowNull: false },
    country: { type: SQLHelper.dataTypes.STRING, allowNull: true }
  },
  { timestamps: true, version: true }
);

module.exports = {
  get<%= objectName %>: get<%= objectName %>,
  create<%= objectName %>: create<%= objectName %>,
  update<%= objectName %>: update<%= objectName %>,
  delete<%= objectName %>: delete<%= objectName %>,
  get<%= objectName %>s: get<%= objectName %>s,
  delete<%= objectName %>s: delete<%= objectName %>s,
  start: <%= objectName %>, // warning : apart from init, do not use for anything else
  close: SQLHelper.close
};

async function get<%= objectName %>(id) {
  return await <%= objectName %>.findByPk(id);
}

async function create<%= objectName %>(<%= objectNameLowerCase %>) {
  const <%= objectNameLowerCase %>Data = await <%= objectName %>.create({
    name: <%= objectNameLowerCase %>.name,
    age: <%= objectNameLowerCase %>.age,
    address: <%= objectNameLowerCase %>.address
  });
  logger.debug(`create<%= objectName %>: creating <%= objectNameLowerCase %>: ${JSON.stringify(<%= objectNameLowerCase %>)}`);
  return <%= objectNameLowerCase %>Data;
}

async function update<%= objectName %>(id, <%= objectNameLowerCase %>) {
  let result = await <%= objectName %>.findByPk(id);
  if (!result) {
    logger.error(`update<%= objectName %>: <%= objectNameLowerCase %>Id ${id} not found`);
    return null;
  }
  if (<%= objectNameLowerCase %>.age) result.age = <%= objectNameLowerCase %>.age;
  if (<%= objectNameLowerCase %>.address) result.address = <%= objectNameLowerCase %>.address;
  if (<%= objectNameLowerCase %>.name) result.name = <%= objectNameLowerCase %>.name;
  logger.debug(`update<%= objectName %>: updated <%= objectNameLowerCase %>: ${JSON.stringify(<%= objectNameLowerCase %>)}`);
  await result.save();
  return <%= objectNameLowerCase %>;
}

async function delete<%= objectName %>(id) {
  let result = await <%= objectName %>.destroy({ where: { id: id } });
  if (result != 1) {
    logger.error(`delete<%= objectName %>: <%= objectNameLowerCase %>Id ${id} not found`);
    return false;
  }
  return true;
}
async function get<%= objectName %>s(top, skip) {
  const result = await <%= objectName %>.findAndCountAll({
    where: {},
    limit: top,
    offset: skip
  });
  return {
    count: result.count,
    values: result.rows
  };
}

async function delete<%= objectName %>s() {
  let result = await <%= objectName %>.destroy({ where: {} });
  return { count: result };
}
