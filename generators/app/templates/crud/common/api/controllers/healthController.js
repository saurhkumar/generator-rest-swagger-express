const healthService = require('../services/healthService.js');
const logger = require('../../logger.js')(__filename);

module.exports = {
  getLive: getLive,
  getReady: getReady
};

async function getLive(req, res) {
  try {
    const result = await healthService.getLive();
    if (result) {
      return res.json({ status: 'ok' });
    } else {
      throw { statusCode: 503, message: 'Error' };
    }
  } catch (error) {
    logger.error(`getLive: Error while getLive: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function getReady(req, res) {
  try {
    const result = await healthService.getReady();
    const appReady = result.isHealthy;
    delete result.isHealthy;
    if (appReady) {
      return res.json(result);
    } else {
      return res.status(503).send(result);
    }
  } catch (error) {
    logger.error(`getReady: Error while getReady: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}
