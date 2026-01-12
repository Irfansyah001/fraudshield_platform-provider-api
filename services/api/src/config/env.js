const crypto = require('crypto');
require('dotenv').config();

// Menghasilkan secret acak untuk development (tidak aman untuk production)
const generateDevSecret = () => crypto.randomBytes(32).toString('hex');

const config = {
  // Konfigurasi Server
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Konfigurasi Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fraudshield',
  },
  
  // Konfigurasi JWT (JSON Web Token)
  jwt: {
    // Di production WAJIB menggunakan JWT_SECRET dari environment
    // Di development, gunakan secret acak per-session
    secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
      ? null // Akan error di validasi
      : generateDevSecret()),
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  
  // Konfigurasi API Key
  apiKey: {
    hashSecret: process.env.API_KEY_HASH_SECRET || '',
    prefix: 'fs_live_',
    randomLength: 32,
  },
  
  // Konfigurasi CORS (Cross-Origin Resource Sharing)
  cors: {
    // Di production, WAJIB menggunakan domain spesifik
    origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' 
      ? null // Akan error di validasi
      : 'http://localhost:3000'),
  },
  
  // Konfigurasi Pembatasan Jumlah Request (Rate Limiting)
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  
  // Konfigurasi Ambang Batas Penilaian Fraud
  scoring: {
    velocityWindow: 5 * 60 * 1000, // 5 menit dalam milidetik
    velocityThresholdMedium: 3,
    velocityThresholdHigh: 6,
    velocityRiskMedium: 40,
    velocityRiskHigh: 80,
    dailyLimitMedium: 1000000,
    dailyLimitHigh: 2000000,
    dailyLimitRiskMedium: 30,
    dailyLimitRiskHigh: 70,
    declineThreshold: 80,
    reviewThreshold: 50,
  },
};

// Validasi environment variables yang wajib ada di mode production
if (config.nodeEnv === 'production') {
  const required = ['JWT_SECRET', 'DB_PASSWORD', 'CORS_ORIGIN'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('⚠️  KEAMANAN: Missing critical environment variables untuk production!');
    throw new Error(`[SECURITY] Environment variables berikut WAJIB diset di production: ${missing.join(', ')}`);
  }
  
  // Validasi tambahan
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('[SECURITY] JWT_SECRET harus minimal 32 karakter untuk keamanan yang baik');
  }
  
  if (process.env.CORS_ORIGIN === '*') {
    throw new Error('[SECURITY] CORS_ORIGIN tidak boleh "*" di production. Gunakan domain spesifik.');
  }
}

// Peringatan di mode development
if (config.nodeEnv === 'development') {
  console.log('⚠️  Mode Development: Menggunakan konfigurasi keamanan development (JANGAN gunakan di production!)');
}

module.exports = config;
