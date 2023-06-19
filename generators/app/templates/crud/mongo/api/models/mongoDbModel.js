const mongoose = require('mongoose');

const mongoHelper = require('../helpers/mongoHelper');
const queryHelper = require('../helpers/queryHelper');

const logger = require('../../logger')(__filename);
const shortId = require('../helpers/shortId');

const <%= objectNameLowerCase %>Schema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, index: true },
    age: { type: Number, index: true },
    address: { type: String, index: true },
    country: { type: String, index: true },
    isActive: { type: Boolean, index: true },
    metadata: { type: Object, index: true }
  },
  {
    minimize: false,
    timestamps: true,
    versionKey: '__v',
    id: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const <%= objectName %> = mongoose.model('<%= objectName %>', <%= objectNameLowerCase %>Schema);

module.exports = {
  get<%= objectName %>: get<%= objectName %>,
  create<%= objectName %>: create<%= objectName %>,
  update<%= objectName %>: update<%= objectName %>,
  delete<%= objectName %>: delete<%= objectName %>,
  get<%= objectName %>s: get<%= objectName %>s,
  delete<%= objectName %>s: delete<%= objectName %>s,
  copy: copy,
  start: mongoHelper.connect,
  close: mongoHelper.close
};

async function get<%= objectName %>(id) {
  return await <%= objectName %>.findById(id);
}

async function create<%= objectName %>(<%= objectNameLowerCase %>) {
  const <%= objectNameLowerCase %>Data = await <%= objectName %>.create({
    _id: shortId.generate(),
    name: <%= objectNameLowerCase %>.name,
    age: <%= objectNameLowerCase %>.age,
    address: <%= objectNameLowerCase %>.address,
    country: <%= objectNameLowerCase %>.country,
    isActive: <%= objectNameLowerCase %>.isActive,
    metadata: <%= objectNameLowerCase %>.metadata
  });
  logger.debug(`create<%= objectName %>: creating <%= objectNameLowerCase %>: ${JSON.stringify(<%= objectNameLowerCase %>)}`);
  return <%= objectNameLowerCase %>Data;
}

async function update<%= objectName %>(id, <%= objectNameLowerCase %>) {
  let result = await <%= objectName %>.findById(id);
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
  return await result.save();
}

async function delete<%= objectName %>(id) {
  let result = await <%= objectName %>.deleteOne({ _id: id });
  if (result.deletedCount != 1) {
    logger.error(`delete<%= objectName %>: <%= objectNameLowerCase %>Id ${id} not found`);
    return false;
  }
  return true;
}
async function get<%= objectName %>s(top, skip, filter, sortBy, projection) {
  const sortConfig = queryHelper.transformSortBy(sortBy);
  const filterConfig = queryHelper.transformQuery(filter);
  const projectionConfig = queryHelper.transFormProjection(projection);

  logger.info(
    `get<%= objectName %>s: getting <%= objectName %>, top: ${top}, skip: ${skip}, filter: ${filter}, sortBy: ${sortConfig}, projection: ${projection}`
  );

  const result = await <%= objectName %>.find(filterConfig, [], {
    limit: top, // number of top document return
    skip: skip // number of doc to skip
  })
    .sort(sortConfig)
    .select(projectionConfig);

  // move this to pagination
  let totalDoc = await <%= objectName %>.countDocuments(filterConfig).lean(); // potential sol : use $facet
  return {
    count: totalDoc,
    values: result
  };
}

async function delete<%= objectName %>s(filter) {
  const filterConfig = queryHelper.transformQuery(filter);
  logger.info(
    `delete<%= objectName %>s: removing all <%= objectName %>s, for query: ${JSON.stringify(
      filterConfig
    )}`
  );
  let result = await <%= objectName %>.deleteMany(filterConfig);
  return { count: result.deletedCount };
}

function copy(dbObj) {
  return dbObj.toJSON();
}
