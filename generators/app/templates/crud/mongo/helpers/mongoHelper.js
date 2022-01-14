const mongoose = require('mongoose');
const logger = require('../../logger')(__filename);

async function connect(dbConfig) {
  let config = {
    maxPoolSize: 200,
    minPoolSize: 100,
    socketTimeoutMS: 3000,
    serverSelectionTimeoutMS: 10000,
    heartbeatFrequencyMS: 15000,
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

  await mongoose.connect(dbConfig.server, config);
}

async function close() {
  await mongoose.connection.close();
}

mongoose.connection.on('disconnected', () => {
  logger.info('connection lost');
});
// The driver tries to automatically reconnect by default, so when the
// server starts the driver will reconnect and emit a 'reconnect' event.
mongoose.connection.on('reconnect', () => {
  logger.info('Reconnecting');
});

// Mongoose will also emit a 'connected' event along with 'reconnect'. These
// events are interchangeable.
mongoose.connection.on('connected', () => {
  logger.info('Connected');
});

module.exports = {
  connect: connect,
  close: close
};
