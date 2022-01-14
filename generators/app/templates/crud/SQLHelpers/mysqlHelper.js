// Just for connection management

const { Sequelize } = require('sequelize');

class MYSQLHelper {
  constructor() {
    this.dbConfig = null;
    this.sequelize = null;
  }

  connect(dbConfig) {
    this.dbConfig = dbConfig;
    //connect
    this.sequelize = new Sequelize(
      this.dbConfig.name,
      this.dbConfig.user,
      this.dbConfig.password,
      {
        host: this.dbConfig.server,
        dialect: 'mysql',
        logging: this.dbConfig.logging
      }
    );
    return this.sequelize;
  }

  async close() {
    await this.sequelize.close();
  }
}

module.exports = new MYSQLHelper(); // singleton
