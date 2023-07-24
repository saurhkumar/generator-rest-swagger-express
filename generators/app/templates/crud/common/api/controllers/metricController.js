const metricService = require('../services/metricService');
const logger = require('../../logger')(__filename);
const middlewares = require('../helpers/middlewares');

module.exports = {
  getMetrics: middlewares.controllerMiddleware(getMetrics)
};

async function getMetrics(req, res) {
  try {
    const response = await metricService.getMetrics();
    res.setHeader('Content-Type', response.contentType);
    return res.send(response.result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`getMetric: Error while getMetrics: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}
