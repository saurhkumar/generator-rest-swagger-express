const service = require('../services/service');
const logger = require('../../logger')(__filename);
module.exports = {
  get<%= objectName %>: get<%= objectName %>,
  create<%= objectName %>: create<%= objectName %>,
  update<%= objectName %>: update<%= objectName %>,
  delete<%= objectName %>: delete<%= objectName %>,
  get<%= objectName %>s: get<%= objectName %>s,
  delete<%= objectName %>s: delete<%= objectName %>s
};

async function get<%= objectName %>(req, res) {
  try {
    const result = await service.get<%= objectName %>(req.params.id);
    if (!result) return res.status(404).send({ message: 'Not Found' });
    return res.json(result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`get<%= objectName %>s: Error while get<%= objectName %>: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function create<%= objectName %>(req, res) {
  try {
    const result = await service.create<%= objectName %>(req.body);
    return res.json(result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`create<%= objectName %>: Error while creating <%= objectName %>: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function update<%= objectName %>(req, res) {
  try {
    const result = await service.update<%= objectName %>(req.params.id, req.body);
    if (!result) return res.status(404).send({ message: 'Not Found' });
    return res.json(result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`update<%= objectName %>: Error while updating <%= objectName %>: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function delete<%= objectName %>(req, res) {
  try {
    const result = await service.delete<%= objectName %>(req.params.id);
    if (!result) return res.status(404).send({ message: 'Not Found' });
    return res.status(204).send();
  } catch (error) /* istanbul ignore next */ {
    logger.error(`delete<%= objectName %>: Error while removing <%= objectName %>: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function get<%= objectName %>s(req, res) {
  try {
    const result = await service.get<%= objectName %>s(req.query.$top, req.query.$skip);
    return res.json(result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`get<%= objectName %>s: Error while get<%= objectName %>s: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}

async function delete<%= objectName %>s(req, res) {
  try {
    const result = await service.delete<%= objectName %>s();
    return res.json(result);
  } catch (error) /* istanbul ignore next */ {
    logger.error(`create<%= objectName %>: Error while get<%= objectName %>s: ${error}`);
    return res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500
    });
  }
}
