const mongoose = require('mongoose');
const config = require('config');

const mongoHelper = require('../helpers/mongoHelper');
const logger = require('../../logger')(__filename);
const shortId = require('../helpers/shortId');

const userSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    age: Number,
    address: String,
    country: String
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

const User = mongoose.model('User', userSchema);

module.exports = {
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUsers: getUsers,
  deleteUsers: deleteUsers,
  start: start,
  close: mongoHelper.close
};

async function start() {
  await mongoHelper.connect(config.Database);
}

async function getUser(id) {
  return await User.findById(id);
}

async function createUser(user) {
  const userData = await User.create({
    _id: shortId.generate(),
    name: user.name,
    age: user.age,
    address: user.address
  });
  logger.debug(`createUser: creating user: ${JSON.stringify(user)}`);
  return userData;
}

async function updateUser(id, user) {
  let result = await User.findById(id);
  if (!result) {
    logger.error(`updateUser: userId ${id} not found`);
    return null;
  }
  if (user.age) result.age = user.age;
  if (user.address) result.address = user.address;
  if (user.name) result.name = user.name;
  logger.debug(`updateUser: updated user: ${JSON.stringify(user)}`);
  await result.save();
  return user;
}

async function deleteUser(id) {
  let result = await User.deleteOne({ _id: id });
  if (result.deletedCount != 1) {
    logger.error(`deleteUser: userId ${id} not found`);
    return false;
  }
  return true;
}
async function getUsers(top, skip) {
  const result = await User.find({}, [], {
    limit: top, // number of top document return
    skip: skip // number of doc to skip
  });
  const totalDoc = (await User.count({}).lean()) - skip;
  return {
    count: totalDoc,
    values: result
  };
}

async function deleteUsers() {
  let result = await User.deleteMany({});
  return { count: result };
}
