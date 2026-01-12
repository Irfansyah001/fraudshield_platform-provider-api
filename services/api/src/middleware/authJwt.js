const jwt = require('jsonwebtoken');
const config = require('../config/env');
const response = require('../utils/response');

/**
 * Middleware Autentikasi JWT
 * Memvalidasi Bearer token dan melampirkan data user ke request
 */
function authJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return response.unauthorized(res, 'Authorization header is required');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return response.unauthorized(res, 'Authorization header must be in format: Bearer <token>');
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user',
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return response.unauthorized(res, 'Token has expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return response.unauthorized(res, 'Invalid token');
    }
    return response.unauthorized(res, 'Token verification failed');
  }
}

/**
 * Membuat JWT token untuk user
 * @param {Object} user - Objek user
 * @returns {string} Token JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

module.exports = {
  authJwt,
  generateToken,
};
