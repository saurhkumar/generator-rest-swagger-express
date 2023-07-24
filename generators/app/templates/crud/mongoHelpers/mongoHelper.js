const mongoose = require('mongoose');
const logger = require('../../logger')(__filename);

async function connect(dbConfig) {
  let config = {
    maxPoolSize: 200,
    minPoolSize: 100,
    socketTimeoutMS: 3000,
    serverSelectionTimeoutMS: 10000,
    heartbeatFrequencyMS: 15000, // sec
    keepAlive: true,
    keepAliveInitialDelay: 300000
  };

  if (dbConfig.name) {
    config['dbName'] = dbConfig.name;
  }

  if (dbConfig.user && dbConfig.password) {
    config['user'] = dbConfig.user;
    config['pass'] = dbConfig.password;
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(dbConfig.server, config);
}

let DBConnected = false;
let DBstate = 'Unknown';

async function close() {
  await mongoose.connection.close();
}

mongoose.connection.on('disconnected', () => {
  DBConnected = false;
  DBstate = 'Disconnected';
  logger.info('connection lost');
});
// The driver tries to automatically reconnect by default, so when the
// server starts the driver will reconnect and emit a 'reconnect' event.
mongoose.connection.on('reconnect', () => {
  DBConnected = true;
  DBstate = 'Connected';
  logger.info('Reconnected');
});

mongoose.connection.on('connecting', () => {
  DBstate = 'Connecting';
  logger.info('Starting database connection');
});

// Mongoose will also emit a 'connected' event along with 'reconnect'. These
// events are interchangeable.
mongoose.connection.on('connected', () => {
  DBstate = 'Connected';
  DBConnected = true;
  logger.info('Connected');
});

mongoose.connection.on('error', (err) => {
  logger.info(`Error while making databse connection:`, err);
});

async function ready() {
  return {
    status: DBConnected,
    message: `database ${
      DBConnected ? '' : 'not'
    } connected, current database state ${DBstate}`
  };
}
async function live() {
  return true;
}

module.exports = {
  connect: connect,
  close: close,
  ready: ready,
  live: live
};
