const rateLimit = require('express-rate-limit');

/**
 * Middleware untuk melindungi endpoint login dari serangan brute-force.
 * 
 * Konfigurasi:
 * - Maksimal 5 percobaan login gagal per IP dalam 15 menit
 * - Setelah melebihi batas, akan di-block selama 15 menit
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 percobaan per window
  skipSuccessfulRequests: true, // Hanya menghitung request yang gagal
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.',
    },
  },
  // Menggunakan IP dan email untuk rate limiting yang lebih efektif
  keyGenerator: (req) => {
    const email = req.body?.email || 'unknown';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return `login:${ip}:${email}`;
  },
});

/**
 * Middleware untuk perlindungan brute-force pada register
 * Lebih ketat karena tidak boleh ada spam akun
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // Maksimal 3 pendaftaran per jam per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REGISTRATIONS',
      message: 'Terlalu banyak percobaan pendaftaran. Silakan coba lagi dalam 1 jam.',
    },
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
};
