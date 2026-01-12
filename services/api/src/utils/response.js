/**
 * Respons sukses standar
 * @param {Object} res - Objek response Express
 * @param {Object} data - Data respons
 * @param {number} statusCode - Kode status HTTP
 */
function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Respons data berhasil dibuat
 * @param {Object} res - Objek response Express
 * @param {Object} data - Data respons
 */
function created(res, data) {
  return success(res, data, 201);
}

/**
 * Respons tanpa konten
 * @param {Object} res - Objek response Express
 */
function noContent(res) {
  return res.status(204).send();
}

/**
 * Respons error standar
 * @param {Object} res - Objek response Express
 * @param {string} code - Kode error
 * @param {string} message - Pesan error
 * @param {number} statusCode - Kode status HTTP
 * @param {Object} details - Detail error tambahan
 */
function error(res, code, message, statusCode = 400, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details) {
    response.error.details = details;
  }
  return res.status(statusCode).json(response);
}

/**
 * Error permintaan tidak valid
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 * @param {Object} details - Detail error tambahan
 */
function badRequest(res, message = 'Bad request', details = null) {
  return error(res, 'BAD_REQUEST', message, 400, details);
}

/**
 * Error tidak terotorisasi
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 */
function unauthorized(res, message = 'Unauthorized') {
  return error(res, 'UNAUTHORIZED', message, 401);
}

/**
 * Error akses ditolak
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 */
function forbidden(res, message = 'Forbidden') {
  return error(res, 'FORBIDDEN', message, 403);
}

/**
 * Error tidak ditemukan
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 */
function notFound(res, message = 'Resource not found') {
  return error(res, 'NOT_FOUND', message, 404);
}

/**
 * Error konflik data
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 */
function conflict(res, message = 'Resource already exists') {
  return error(res, 'CONFLICT', message, 409);
}

/**
 * Error server internal
 * @param {Object} res - Objek response Express
 * @param {string} message - Pesan error
 */
function serverError(res, message = 'Internal server error') {
  return error(res, 'INTERNAL_ERROR', message, 500);
}

module.exports = {
  success,
  created,
  noContent,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
};
