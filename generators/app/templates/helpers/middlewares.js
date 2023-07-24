const prometheusHelper = require('./prometheusHelper');

module.exports = {
  controllerMiddleware: controllerMiddleware
};
function controllerMiddleware(controllerFunction) {
  return async function (req, res) {
    // proetheus
    const end = prometheusHelper.getRequestTimer().startTimer();
    // call all the preprocessing here for a controller
    let result = await controllerFunction.call(this, req, res);
    // result already sent
    end({
      code: result.statusCode || 500,
      method: req.method,
      path: req.openapi.expressRoute
    });
    return result;
  };
}
