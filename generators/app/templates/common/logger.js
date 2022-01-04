const winston = require('winston');
const config = require('config');
const path = require('path');
const fs = require('fs');

let logger = winston.createLogger({
  level: config.Log.level,
  silent: config.Log.silent,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss.SSS'
    }),
    winston.format.json()
  ),
  defaultMeta: { service: config.App.name }
});
module.exports = function (fileName) {
  const name = path.basename(fileName);
  return {
    switchToFile: () => {
      try {
        fs.unlinkSync(fileName);
      } catch (error) {
        // Do Noting
      }
      logger = winston.createLogger({
        level: config.Log.level,
        silent: config.Log.silent,
        transports: [new winston.transports.File({ filename: fileName })],
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss.SSS'
          }),
          winston.format.json()
        ),
        defaultMeta: { service: config.App.name }
      });
    },
    info: (message, meta) => {
      logger.info(message, mergeMeta({ file: name }, meta));
    },
    error: (message, meta) => {
      logger.error(message, mergeMeta({ file: name }, meta));
    },
    debug: (message, meta) => {
      logger.debug(message, mergeMeta({ file: name }, meta));
    },
    verbose: (message, meta) => {
      logger.verbose(message, mergeMeta({ file: name }, meta));
    }
  };
};

function mergeMeta(...objs) {
  return Object.assign({}, ...objs);
}
