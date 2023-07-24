const config = require('config');
const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();
const appName = config.App.name.split('-').join('');
client.collectDefaultMetrics({
  register: register,
  prefix: `${appName}_`,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  labels: { NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE }
});

const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'code'],
  buckets: [0.1, 0.5, 0.7, 1, 5, 7, 10] // 0.1 to 10 seconds
});
// Register the histogram
register.registerMetric(httpRequestTimer);
module.exports = {
  register: register,
  client: client,
  getRequestTimer: getRequestTimer
};

function getRequestTimer() {
  return httpRequestTimer;
}
