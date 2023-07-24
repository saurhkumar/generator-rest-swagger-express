const prometheusHelper = require('../helpers/prometheusHelper');

module.exports = {
  getMetrics: getMetrics
};

async function getMetrics() {
  return {
    contentType: prometheusHelper.register.contentType,
    result: await prometheusHelper.register.metrics()
  };
}
