const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const config = require('config');
const SwaggerParser = require('@apidevtools/swagger-parser');
const OpenApiValidator = require('express-openapi-validator');

const swaggerDocument = require('./api/swagger/swagger.json');
const syncService = require('./api/services/syncService');

const logger = require('./logger')(__filename);

const v1BasePath = config.App.v1Path;
const port = config.App.port;

module.exports = {
  app: app,
  start: syncService.start,
  stop: syncService.stop
};
app.use(cors());

app.use(function (req, res, next) {
  logger.info(`Start ${req.url}`, { method: req.method });
  next();
});

app.use(function (req, res, next) {
  // console.log('---start--in cors-' + als.get('id'));
  req.headers['x-correlation-id']; // correlationId

  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// check swagger document : if not valid throw error and do not start application
SwaggerParser.validate(swaggerDocument, (err) => {
  if (err) {
    logger.error(err);
    throw err;
  }
});

app.use(
  `/${config.App.name}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// validation middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: `${__dirname}/api/swagger/swagger.json`,
    // validateRequests: true, // (default)
    validateRequests: {
      allowUnknownQueryParameters: false
    }, // (default)
    validateResponses: false // false by default
  })
);

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  logger.info(`End ${req.url}`, {
    statusCode: res.statusCode,
    method: req.method
  });
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors
  });
});

app.use(function (req, res, next) {
  res.on('finish', function () {
    logger.info(`End ${req.url}`, {
      statusCode: res.statusCode,
      method: req.method
    });
  });
  next();
});

// read swagger file and attach all path
for (const [path, pathAttributes] of Object.entries(swaggerDocument.paths)) {
  const controllerId = pathAttributes['x-controller'];
  let controllerPath = `${__dirname}/api/controllers/${controllerId}`;
  let controller = require(controllerPath);
  for (const [verb, value] of Object.entries(pathAttributes)) {
    if (verb == 'x-controller') continue;
    const operationId = value?.operationId;
    let pathPattern = [];
    path.split('/').forEach((element) => {
      // convert : /path1/{id1}/path2/{id2}/path3 ==> /path1/:id1/path2/id2/path3
      if (element.length) {
        if (element.endsWith('}') && element.startsWith('{')) {
          pathPattern.push(`:${element.slice(1, -1)}`); // remove {}
        } else {
          pathPattern.push(element);
        }
      }
    });
    // adding path dynamically like app.get("/v1/path1/:id1/path2/:id2/path3", helloController.hello1);
    app[`${verb}`](
      `${v1BasePath}/${pathPattern.join('/')}`,
      controller[`${operationId}`]
    );
  }
}

if (require.main === module) {
  app.listen(port, async () => {
    logger.info(`Example app listening at http://localhost:${port}`);
    logger.info(`Starting background services`);
    await syncService.start();
  });
}
