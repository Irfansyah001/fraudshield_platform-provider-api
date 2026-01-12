const db = require('../config/db');
const { generateApiKey, extractKeyPrefix, hashApiKey } = require('../utils/crypto');

/**
 * Membuat API key baru untuk user
 * @param {number} userId - ID User
 * @param {string} name - Nama key
 * @returns {Promise<Object>} Key yang dibuat dengan API key lengkap (hanya dikembalikan sekali)
 */
async function createKey(userId, name = 'Default Key') {
  const fullKey = generateApiKey();
  const prefix = extractKeyPrefix(fullKey);
  const keyHash = hashApiKey(fullKey);

  const id = await db.insert(
    `INSERT INTO api_keys (user_id, name, prefix, key_hash, status)
     VALUES (?, ?, ?, ?, 'ACTIVE')`,
    [userId, name, prefix, keyHash]
  );

  const createdKey = await db.queryOne(
    'SELECT id, name, prefix, status, created_at FROM api_keys WHERE id = ?',
    [id]
  );

  return {
    id: createdKey.id,
    name: createdKey.name,
    prefix: createdKey.prefix,
    status: createdKey.status,
    created_at: createdKey.created_at,
    api_key: fullKey, // Hanya dikembalikan saat pembuatan
  };
}

/**
 * Menampilkan daftar semua API key untuk user
 * @param {number} userId - ID User
 * @returns {Promise<Array>} Daftar key (tanpa data sensitif)
 */
async function listKeys(userId) {
  const keys = await db.query(
    `SELECT id, name, prefix, status, last_used_at, created_at
     FROM api_keys
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return keys;
}

/**
 * Mengambil satu API key berdasarkan ID (untuk user tertentu)
 * @param {number} keyId - ID Key
 * @param {number} userId - ID User
 * @returns {Promise<Object|null>} Key atau null jika tidak ditemukan
 */
async function getKeyById(keyId, userId) {
  const key = await db.queryOne(
    `SELECT id, name, prefix, status, last_used_at, created_at
     FROM api_keys
     WHERE id = ? AND user_id = ?`,
    [keyId, userId]
  );

  return key;
}

/**
 * Mencabut API key (soft delete)
 * @param {number} keyId - ID Key
 * @param {number} userId - ID User
 * @returns {Promise<boolean>} Status keberhasilan
 */
async function revokeKey(keyId, userId) {
  const affectedRows = await db.execute(
    `UPDATE api_keys
     SET status = 'REVOKED', updated_at = NOW()
     WHERE id = ? AND user_id = ? AND status = 'ACTIVE'`,
    [keyId, userId]
  );

  return affectedRows > 0;
}

/**
 * Mengambil key berdasarkan ID tanpa pengecekan user (untuk penggunaan internal)
 * @param {number} keyId - ID Key
 * @returns {Promise<Object|null>} Key atau null
 */
async function getKeyByIdInternal(keyId) {
  const key = await db.queryOne(
    'SELECT id, user_id, name, prefix, status, last_used_at FROM api_keys WHERE id = ?',
    [keyId]
  );

  return key;
}

module.exports = {
  createKey,
  listKeys,
  getKeyById,
  revokeKey,
  getKeyByIdInternal,
};
