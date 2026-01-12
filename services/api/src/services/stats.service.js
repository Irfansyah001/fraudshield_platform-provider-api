const db = require('../config/db');

/**
 * Mencatat penggunaan API
 */
async function logApiUsage(userId, apiKeyId, endpoint, method, statusCode, responseTimeMs, ipAddress) {
  await db.insert(
    `INSERT INTO api_usage_logs (user_id, api_key_id, endpoint, method, status_code, response_time_ms, ip_address) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, apiKeyId, endpoint, method, statusCode, responseTimeMs, ipAddress]
  );
}

/**
 * Mengambil statistik dashboard untuk user
 */
async function getDashboardStats(userId) {
  // Total request bulan ini (menggunakan transaksi scoring)
  const totalRequests = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     AND t.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Total request bulan lalu (untuk perbandingan)
  const lastMonthRequests = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     AND t.created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
     AND t.created_at < DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Fraud terdeteksi bulan ini (dari transactions)
  const fraudDetected = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ? 
     AND t.decision = 'DECLINE'
     AND t.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Fraud bulan lalu
  const lastMonthFraud = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ? 
     AND t.decision = 'DECLINE'
     AND t.created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
     AND t.created_at < DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Request aman bulan ini
  const safeRequests = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ? 
     AND t.decision = 'APPROVE'
     AND t.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Rata-rata response time (jika logging enabled)
  const avgResponseTime = await db.queryOne(
    `SELECT AVG(response_time_ms) as avg_time FROM api_usage_logs 
     WHERE user_id = ?
     AND endpoint = '/v1/score'
     AND created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  // Hitung persentase perubahan
  const calcChange = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
  };

  return {
    total_requests: totalRequests?.count || 0,
    total_requests_change: calcChange(totalRequests?.count || 0, lastMonthRequests?.count || 0),
    fraud_detected: fraudDetected?.count || 0,
    fraud_detected_change: calcChange(fraudDetected?.count || 0, lastMonthFraud?.count || 0),
    safe_requests: safeRequests?.count || 0,
    avg_response_time: Math.round(avgResponseTime?.avg_time || 0),
  };
}

/**
 * Mengambil transaksi terbaru untuk user
 */
async function getRecentTransactions(userId, limit = 10) {
  const parsedLimit = Number.parseInt(String(limit), 10);
  const safeLimit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 10;

  const transactions = await db.query(
    `SELECT t.id, t.external_txn_id, t.account_id, t.risk_score, t.decision, t.created_at
     FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     ORDER BY t.created_at DESC
     LIMIT ${safeLimit}`,
    [userId]
  );

  return transactions.map(t => ({
    id: t.external_txn_id || t.id,
    account_id: t.account_id,
    risk_score: t.risk_score / 100, // Konversi ke 0-1
    status: t.decision === 'APPROVE' ? 'low' : t.decision === 'REVIEW' ? 'medium' : 'high',
    created_at: t.created_at,
  }));
}

/**
 * Mengambil penggunaan harian untuk chart
 */
async function getDailyUsage(userId, days = 7) {
  const parsedDays = Number.parseInt(String(days), 10);
  const safeDays = Number.isFinite(parsedDays) ? Math.min(Math.max(parsedDays, 1), 365) : 7;

  // Requests per hari: gunakan `transactions` agar konsisten dengan “Total Request”.
  const txnByDay = await db.query(
    `SELECT 
       DATE(t.created_at) as date,
       COUNT(*) as requests
     FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(t.created_at)
     ORDER BY date ASC`,
    [userId, safeDays]
  );

  // Errors per hari: jika api_usage_logs belum terisi, akan menjadi 0.
  const errorsByDay = await db.query(
    `SELECT 
       DATE(created_at) as date,
       SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors
     FROM api_usage_logs
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at)`,
    [userId, safeDays]
  );

  const errorsMap = {};
  errorsByDay.forEach(e => {
    errorsMap[e.date] = e.errors;
  });

  // Ambil fraud per hari juga
  const fraudByDay = await db.query(
    `SELECT 
       DATE(t.created_at) as date,
       COUNT(*) as fraud
     FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ? 
     AND t.decision = 'DECLINE'
     AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(t.created_at)`,
    [userId, safeDays]
  );

  const fraudMap = {};
  fraudByDay.forEach(f => {
    fraudMap[f.date] = f.fraud;
  });

  return txnByDay.map(t => ({
    date: t.date,
    requests: t.requests,
    errors: errorsMap[t.date] || 0,
    fraud: fraudMap[t.date] || 0,
  }));
}

/**
 * Mengambil statistik per endpoint
 */
async function getEndpointStats(userId) {
  const stats = await db.query(
    `SELECT 
       CONCAT(method, ' ', endpoint) as endpoint,
       COUNT(*) as calls,
       AVG(response_time_ms) as avg_time,
       SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) / COUNT(*) * 100 as success_rate
     FROM api_usage_logs
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY method, endpoint
     ORDER BY calls DESC
     LIMIT 10`,
    [userId]
  );

  // Fallback: jika api_usage_logs belum terisi, tampilkan minimal agregasi dari transactions.
  if (!stats || stats.length === 0) {
    const txnCalls = await db.queryOne(
      `SELECT COUNT(*) as calls
       FROM transactions t
       JOIN api_keys ak ON t.api_key_id = ak.id
       WHERE ak.user_id = ?
       AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId]
    );

    const calls = txnCalls?.calls || 0;
    if (calls === 0) return [];

    return [
      {
        endpoint: 'POST /v1/score',
        calls,
        avg_time: '-',
        success_rate: '—',
      },
    ];
  }

  return stats.map(s => ({
    endpoint: s.endpoint,
    calls: s.calls,
    avg_time: Math.round(s.avg_time) + 'ms',
    success_rate: (() => {
      const rate = Number(s.success_rate);
      if (!Number.isFinite(rate)) return '0.0%';
      return rate.toFixed(1) + '%';
    })(),
  }));
}

/**
 * Mengambil usage summary untuk periode tertentu
 */
async function getUsageSummary(userId, period = '7d') {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const safeDays = Math.min(Math.max(days, 1), 365);

  // Total dan limit
  const total = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [userId, safeDays]
  );

  // Fraud terdeteksi
  const fraud = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ? 
     AND t.decision = 'DECLINE'
     AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [userId, safeDays]
  );

  // Rata-rata response time
  const avgTime = await db.queryOne(
    `SELECT AVG(response_time_ms) as avg FROM api_usage_logs 
     WHERE user_id = ?
     AND endpoint = '/v1/score'
     AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [userId, safeDays]
  );

  // Success rate
  const successRate = await db.queryOne(
    `SELECT 
       SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) / COUNT(*) * 100 as rate
     FROM api_usage_logs
     WHERE user_id = ?
     AND endpoint = '/v1/score'
     AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [userId, safeDays]
  );

  // Limit bulanan (hardcoded, bisa diambil dari tabel plans)
  const monthlyLimit = 50000;
  const monthlyTotal = await db.queryOne(
    `SELECT COUNT(*) as count FROM transactions t
     JOIN api_keys ak ON t.api_key_id = ak.id
     WHERE ak.user_id = ?
     AND t.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
    [userId]
  );

  return {
    total: total?.count || 0,
    limit: monthlyLimit,
    remaining: monthlyLimit - (monthlyTotal?.count || 0),
    fraud_detected: fraud?.count || 0,
    avg_response_time: Math.round(avgTime?.avg || 0),
    success_rate: (() => {
      const rate = Number(successRate?.rate);
      const safe = Number.isFinite(rate) ? rate : 100;
      return parseFloat(safe.toFixed(1));
    })(),
  };
}

module.exports = {
  logApiUsage,
  getDashboardStats,
  getRecentTransactions,
  getDailyUsage,
  getEndpointStats,
  getUsageSummary,
};
