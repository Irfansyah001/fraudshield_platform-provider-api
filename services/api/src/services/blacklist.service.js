const db = require('../config/db');

/**
 * Membuat entri blacklist baru
 * @param {number} userId - ID User
 * @param {Object} data - Data entri blacklist
 * @returns {Promise<Object>} Entri yang dibuat
 */
async function createEntry(userId, { type, value, reason = null }) {
  const id = await db.insert(
    `INSERT INTO blacklist_entries (user_id, type, value, reason, active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [userId, type, value, reason]
  );

  return getEntryById(id, userId);
}

/**
 * Menampilkan daftar entri blacklist untuk user dengan filter opsional
 * @param {number} userId - ID User
 * @param {Object} filters - Filter opsional (type, active)
 * @returns {Promise<Array>} Daftar entri
 */
async function listEntries(userId, filters = {}) {
  let sql = `SELECT id, type, value, reason, active, created_at, updated_at
             FROM blacklist_entries
             WHERE user_id = ?`;
  const params = [userId];

  if (filters.type) {
    sql += ' AND type = ?';
    params.push(filters.type);
  }

  if (filters.active !== undefined) {
    sql += ' AND active = ?';
    params.push(filters.active === 'true' || filters.active === true);
  }

  sql += ' ORDER BY created_at DESC';

  return db.query(sql, params);
}

/**
 * Mengambil satu entri blacklist berdasarkan ID
 * @param {number} entryId - ID Entri
 * @param {number} userId - ID User
 * @returns {Promise<Object|null>} Entri atau null
 */
async function getEntryById(entryId, userId) {
  const entry = await db.queryOne(
    `SELECT id, type, value, reason, active, created_at, updated_at
     FROM blacklist_entries
     WHERE id = ? AND user_id = ?`,
    [entryId, userId]
  );

  return entry;
}

/**
 * Memperbarui entri blacklist
 * @param {number} entryId - ID Entri
 * @param {number} userId - ID User
 * @param {Object} data - Data pembaruan
 * @returns {Promise<Object|null>} Entri yang diperbarui atau null
 */
async function updateEntry(entryId, userId, data) {
  const updates = [];
  const params = [];

  if (data.type !== undefined) {
    updates.push('type = ?');
    params.push(data.type);
  }
  if (data.value !== undefined) {
    updates.push('value = ?');
    params.push(data.value);
  }
  if (data.reason !== undefined) {
    updates.push('reason = ?');
    params.push(data.reason);
  }
  if (data.active !== undefined) {
    updates.push('active = ?');
    params.push(data.active);
  }

  if (updates.length === 0) {
    return getEntryById(entryId, userId);
  }

  updates.push('updated_at = NOW()');
  params.push(entryId, userId);

  await db.execute(
    `UPDATE blacklist_entries
     SET ${updates.join(', ')}
     WHERE id = ? AND user_id = ?`,
    params
  );

  return getEntryById(entryId, userId);
}

/**
 * Menghapus entri blacklist
 * @param {number} entryId - ID Entri
 * @param {number} userId - ID User
 * @returns {Promise<boolean>} Status keberhasilan
 */
async function deleteEntry(entryId, userId) {
  const affectedRows = await db.execute(
    'DELETE FROM blacklist_entries WHERE id = ? AND user_id = ?',
    [entryId, userId]
  );

  return affectedRows > 0;
}

/**
 * Mengecek apakah suatu nilai ada di blacklist untuk user tertentu
 * @param {number} userId - ID User
 * @param {string} type - Tipe blacklist
 * @param {string} value - Nilai yang dicek
 * @returns {Promise<Object|null>} Entri yang cocok atau null
 */
async function checkBlacklist(userId, type, value) {
  if (!value) return null;

  const entry = await db.queryOne(
    `SELECT id, type, value, reason
     FROM blacklist_entries
     WHERE user_id = ? AND type = ? AND value = ? AND active = TRUE`,
    [userId, type, value]
  );

  return entry;
}

/**
 * Mengecek beberapa nilai terhadap blacklist
 * @param {number} userId - ID User
 * @param {Object} checks - Nilai yang dicek { account_id, merchant_id, ip, country }
 * @returns {Promise<Array>} Array entri yang cocok
 */
async function checkMultipleBlacklist(userId, checks) {
  const matches = [];

  if (checks.account_id) {
    const match = await checkBlacklist(userId, 'ACCOUNT_ID', checks.account_id);
    if (match) matches.push(match);
  }

  if (checks.merchant_id) {
    const match = await checkBlacklist(userId, 'MERCHANT_ID', checks.merchant_id);
    if (match) matches.push(match);
  }

  if (checks.ip) {
    const match = await checkBlacklist(userId, 'IP', checks.ip);
    if (match) matches.push(match);
  }

  if (checks.country) {
    const match = await checkBlacklist(userId, 'COUNTRY', checks.country);
    if (match) matches.push(match);
  }

  return matches;
}

module.exports = {
  createEntry,
  listEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  checkBlacklist,
  checkMultipleBlacklist,
};
