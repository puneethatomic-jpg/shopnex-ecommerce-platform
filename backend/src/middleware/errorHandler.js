const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path, method: req.method });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

module.exports = errorHandler;
