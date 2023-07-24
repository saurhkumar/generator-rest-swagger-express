const config = require('config');

const logger = require('../../logger')(__filename);
const { DataTypes } = require('sequelize');
const sqlHelper = require('../helpers/sqlHelper');
const shortId = require('../helpers/shortId');
const queryHelper = require('../helpers/SQLQueryHelper');
const sequelize = sqlHelper.connect(config.Database);

const <%= objectName %> = sequelize.define(
  '<%= objectName %>',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: shortId.generate
    },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.SMALLINT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: true },
    metadata: {
      type: DataTypes.STRING,
      allowNull: true,
      get: function () {
        return JSON.parse(this.getDataValue('metadata'));
      },
      set: function (value) {
        return this.setDataValue('metadata', JSON.stringify(value));
      }
    }
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
  copy: copy,
  start: start,
  close: close
};

async function start() {
  // create table if not exist
  await <%= objectName %>.sync();
}

async function close() {
  // close connection
  await sequelize.close();
}

async function get<%= objectName %>(id) {
  return await <%= objectName %>.findByPk(id);
}

async function create<%= objectName %>(<%= objectNameLowerCase %>) {
  const <%= objectNameLowerCase %>Data = await <%= objectName %>.create({
    name: <%= objectNameLowerCase %>.name,
    age: <%= objectNameLowerCase %>.age,
    address: <%= objectNameLowerCase %>.address,
    country: <%= objectNameLowerCase %>.country,
    isActive: <%= objectNameLowerCase %>.isActive || false,
    metadata: <%= objectNameLowerCase %>.metadata || {}
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
  if (<%= objectNameLowerCase %>.isActive != undefined) result.isActive = <%= objectNameLowerCase %>.isActive;
  if (<%= objectNameLowerCase %>.metadata) result.metadata = <%= objectNameLowerCase %>.metadata;
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
async function get<%= objectName %>s(top, skip, filter, sortBy, projection) {
  const sortConfig = queryHelper.transformSortBy(sortBy);
  const filterConfig = queryHelper.transformFilterQuery(filter);
  const projectionConfig = queryHelper.transformProjection(projection);

  let sqlDataQuery = `SELECT ${projectionConfig} from <%= objectName %>s ${filterConfig} ${sortConfig} LIMIT ${top} OFFSET ${skip}`;
  logger.info(`get<%= objectName %>s: getting <%= objectName %>s, query: ${sqlDataQuery}`);
  const data = await sequelize.query(sqlDataQuery, {
    type: 'SELECT'
  });
  let sqlCountQuery = `SELECT COUNT(*) as count from <%= objectName %>s ${filterConfig}`;
  const count = await sequelize.query(sqlCountQuery, {
    type: 'SELECT'
  });
  // fix metadata
  data.forEach((element) => {
    try {
      element.metadata = JSON.parse(element.metadata);
    } catch (error) {
      element.metadata = {};
      // log it
    }
  });
  return {
    count: count[0].count,
    value: data
  };
}

async function delete<%= objectName %>s(filter) {
  const filterConfig = queryHelper.transformFilterQuery(filter);
  let sqlDataQuery = `DELETE from <%= objectName %>s ${filterConfig}`;
  const result = await sequelize.query(sqlDataQuery);
  return { count: result[0].affectedRows };
}

function copy(dbObj) {
  return dbObj.dataValues;
}
