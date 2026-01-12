const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../config/env');

const SALT_ROUNDS = 10;

/**
 * Meng-hash password menggunakan bcrypt
 * @param {string} password - Password dalam bentuk plain text
 * @returns {Promise<string>} Password yang sudah di-hash
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Membandingkan password dengan hash
 * @param {string} password - Password dalam bentuk plain text
 * @param {string} hash - Password yang sudah di-hash
 * @returns {Promise<boolean>} Hasil perbandingan
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Membuat API key secara acak
 * @returns {string} API key lengkap (contoh: fs_live_abc123...)
 */
function generateApiKey() {
  const randomPart = crypto.randomBytes(config.apiKey.randomLength).toString('hex');
  return `${config.apiKey.prefix}${randomPart}`;
}

/**
 * Mengekstrak prefix dari API key
 * @param {string} apiKey - API key lengkap
 * @returns {string} Prefix (12 karakter pertama)
 */
function extractKeyPrefix(apiKey) {
  return apiKey.substring(0, 12);
}

/**
 * Meng-hash API key menggunakan SHA256
 * @param {string} apiKey - API key lengkap
 * @returns {string} Key yang sudah di-hash
 */
function hashApiKey(apiKey) {
  const toHash = config.apiKey.hashSecret ? `${apiKey}${config.apiKey.hashSecret}` : apiKey;
  return crypto.createHash('sha256').update(toHash).digest('hex');
}

/**
 * Membandingkan API key dengan hash menggunakan perbandingan waktu konstan
 * @param {string} apiKey - API key lengkap yang akan diverifikasi
 * @param {string} hash - Hash yang tersimpan
 * @returns {boolean} Hasil perbandingan
 */
function compareApiKey(apiKey, hash) {
  const computedHash = hashApiKey(apiKey);
  try {
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  } catch {
    return false;
  }
}

/**
 * Membuat UUID v4
 * @returns {string} String UUID
 */
function generateUuid() {
  return crypto.randomUUID();
}

module.exports = {
  hashPassword,
  comparePassword,
  generateApiKey,
  extractKeyPrefix,
  hashApiKey,
  compareApiKey,
  generateUuid,
};
