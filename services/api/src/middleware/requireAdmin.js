const response = require('../utils/response');

/**
 * Middleware untuk memastikan user adalah admin
 * Harus digunakan setelah authJwt middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return response.unauthorized(res, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return response.forbidden(res, 'Admin access required');
  }

  next();
}

module.exports = requireAdmin;
