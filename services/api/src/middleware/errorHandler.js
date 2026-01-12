const config = require('../config/env');

/**
 * Middleware Penanganan Error Terpusat
 * Menangkap semua error yang tidak tertangani dan mengembalikan format error yang konsisten
 */
function errorHandler(err, req, res, next) {
  // Log error untuk debugging
  console.error('Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Menangani tipe error spesifik
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }

  // Error entri duplikat MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists',
      },
    });
  }

  // Error constraint foreign key MySQL
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Referenced resource does not exist',
      },
    });
  }

  // Error server default
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : err.message;

  return res.status(statusCode).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
}

/**
 * Handler 404 Tidak Ditemukan
 * Menangkap request ke route yang tidak terdefinisi
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
}

/**
 * Wrapper async handler untuk menangkap error async
 * @param {Function} fn - Handler route async
 * @returns {Function} Middleware Express
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
