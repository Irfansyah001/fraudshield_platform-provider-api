const db = require('../config/db');

/**
 * Membuat catatan transaksi
 * @param {Object} data - Data transaksi
 * @returns {Promise<Object>} Transaksi yang dibuat
 */
async function createTransaction(data) {
  const {
    apiKeyId,
    externalTxnId,
    accountId,
    amount,
    currency,
    availableBalance,
    merchantId,
    ip,
    country,
    timestamp,
    riskScore,
    decision,
    triggeredRules,
  } = data;

  const id = await db.insert(
    `INSERT INTO transactions 
     (api_key_id, external_txn_id, account_id, amount, currency, 
      available_balance, merchant_id, ip, country, timestamp,
      risk_score, decision, triggered_rules_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      apiKeyId,
      externalTxnId,
      accountId,
      amount,
      currency,
      availableBalance,
      merchantId || null,
      ip || null,
      country || null,
      timestamp,
      riskScore,
      decision,
      JSON.stringify(triggeredRules),
    ]
  );

  return { id };
}

/**
 * Mengambil jumlah transaksi untuk akun dalam jendela waktu (pengecekan velocity)
 * @param {number} apiKeyId - ID API Key
 * @param {string} accountId - ID Akun
 * @param {number} windowMs - Jendela waktu dalam milidetik
 * @returns {Promise<number>} Jumlah transaksi
 */
async function getVelocityCount(apiKeyId, accountId, windowMs) {
  const windowStart = new Date(Date.now() - windowMs);

  const result = await db.queryOne(
    `SELECT COUNT(*) as count
     FROM transactions
     WHERE api_key_id = ? AND account_id = ? AND timestamp >= ?`,
    [apiKeyId, accountId, windowStart]
  );

  return result ? result.count : 0;
}

/**
 * Mengambil total nilai transaksi harian untuk akun
 * @param {number} apiKeyId - ID API Key
 * @param {string} accountId - ID Akun
 * @returns {Promise<number>} Jumlah total untuk hari ini
 */
async function getDailySum(apiKeyId, accountId) {
  const result = await db.queryOne(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE api_key_id = ? AND account_id = ? 
     AND DATE(timestamp) = CURDATE()`,
    [apiKeyId, accountId]
  );

  return result ? parseFloat(result.total) : 0;
}

/**
 * Mengambil transaksi untuk API key tertentu
 * @param {number} apiKeyId - ID API Key
 * @param {Object} options - Opsi query
 * @returns {Promise<Array>} Daftar transaksi
 */
async function getTransactions(apiKeyId, options = {}) {
  const { limit = 100, offset = 0, decision } = options;
  
  let sql = `SELECT id, external_txn_id, account_id, amount, currency,
                    merchant_id, ip, country, timestamp, risk_score, 
                    decision, triggered_rules_json, created_at
             FROM transactions
             WHERE api_key_id = ?`;
  const params = [apiKeyId];

  if (decision) {
    sql += ' AND decision = ?';
    params.push(decision);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.query(sql, params);
}

module.exports = {
  createTransaction,
  getVelocityCount,
  getDailySum,
  getTransactions,
};
