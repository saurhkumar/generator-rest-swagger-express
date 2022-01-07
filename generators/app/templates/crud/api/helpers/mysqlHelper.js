// Just for connection management

const config = require('config');
const { Sequelize, DataTypes } = require('sequelize');

let sequelize = new Sequelize(
  config.Database.name,
  config.Database.user,
  config.Database.password,
  {
    host: config.Database.server,
    dialect: 'mysql',
    logging: config.Database.logging
  }
);

function close() {
  sequelize.close();
}

module.exports = {
  sequelize: sequelize,
  dataTypes: DataTypes,
  close: close
};
