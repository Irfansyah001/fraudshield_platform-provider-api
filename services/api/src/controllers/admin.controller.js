const db = require('../config/db');
const response = require('../utils/response');
const { hashPassword } = require('../utils/crypto');

/**
 * Helper untuk mencatat audit log admin
 */
async function logAdminAction(adminId, action, entityType, entityId, oldValues, newValues, req) {
  try {
    await db.insert(
      `INSERT INTO admin_audit_logs 
       (admin_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        action,
        entityType,
        entityId ? String(entityId) : null,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        req.ip || req.connection?.remoteAddress || null,
        req.get('User-Agent') || null,
      ]
    );
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

// ==================== USER MANAGEMENT ====================

/**
 * Mendapatkan semua users
 */
async function getUsers(req, res) {
  const pageNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const status = req.query.status || '';
  const role = req.query.role || '';
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params = [];

  if (search) {
    whereClause += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }
  if (role) {
    whereClause += ' AND role = ?';
    params.push(role);
  }

  const countResult = await db.queryOne(
    `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
    params
  );

  const users = await db.query(
    `SELECT id, name, email, role, status, created_at, updated_at 
     FROM users 
     WHERE ${whereClause}
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return response.success(res, {
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult.total || 0,
      totalPages: Math.ceil((countResult.total || 0) / limitNum),
    },
  });
}

/**
 * Mendapatkan user berdasarkan ID
 */
async function getUserById(req, res) {
  const { id } = req.params;

  const user = await db.queryOne(
    `SELECT id, name, email, role, status, created_at, updated_at 
     FROM users WHERE id = ?`,
    [id]
  );

  if (!user) {
    return response.notFound(res, 'User tidak ditemukan');
  }

  // Ambil statistik user
  const keyCount = await db.queryOne(
    'SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?',
    [id]
  );
  const blacklistCount = await db.queryOne(
    'SELECT COUNT(*) as count FROM blacklist_entries WHERE user_id = ?',
    [id]
  );
  const usageCount = await db.queryOne(
    'SELECT COUNT(*) as count FROM api_usage_logs WHERE user_id = ?',
    [id]
  );

  return response.success(res, {
    ...user,
    stats: {
      api_keys: keyCount.count,
      blacklist_entries: blacklistCount.count,
      api_requests: usageCount.count,
    },
  });
}

/**
 * Membuat user baru
 */
async function createUser(req, res) {
  const { name, email, password, role = 'user' } = req.body;

  if (!name || !email || !password) {
    return response.badRequest(res, 'Name, email, dan password wajib diisi');
  }

  if (!['user', 'admin'].includes(role)) {
    return response.badRequest(res, 'Role harus user atau admin');
  }

  const existingUser = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser) {
    return response.conflict(res, 'Email sudah terdaftar');
  }

  const passwordHash = await hashPassword(password);
  const userId = await db.insert(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );

  const user = await db.queryOne(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
    [userId]
  );

  await logAdminAction(req.user.id, 'CREATE', 'user', userId, null, { name, email, role }, req);

  return response.created(res, {
    message: 'User berhasil dibuat',
    user,
  });
}

/**
 * Update user
 */
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, status, password } = req.body;

  const existingUser = await db.queryOne('SELECT * FROM users WHERE id = ?', [id]);
  if (!existingUser) {
    return response.notFound(res, 'User tidak ditemukan');
  }

  // Simpan data lama untuk audit
  const oldValues = {
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    status: existingUser.status,
  };

  // Build dynamic update
  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (email && email !== existingUser.email) {
    const emailExists = await db.queryOne('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
    if (emailExists) {
      return response.conflict(res, 'Email sudah digunakan');
    }
    updates.push('email = ?');
    params.push(email);
  }
  if (role && ['user', 'admin'].includes(role)) {
    updates.push('role = ?');
    params.push(role);
  }
  if (status && ['active', 'suspended'].includes(status)) {
    updates.push('status = ?');
    params.push(status);
  }
  if (password) {
    const passwordHash = await hashPassword(password);
    updates.push('password_hash = ?');
    params.push(passwordHash);
  }

  if (updates.length === 0) {
    return response.badRequest(res, 'Tidak ada data untuk diupdate');
  }

  updates.push('updated_at = NOW()');
  params.push(id);

  await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

  const user = await db.queryOne(
    'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );

  await logAdminAction(req.user.id, 'UPDATE', 'user', id, oldValues, { name, email, role, status }, req);

  return response.success(res, {
    message: 'User berhasil diupdate',
    user,
  });
}

/**
 * Hapus user
 */
async function deleteUser(req, res) {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return response.badRequest(res, 'Tidak dapat menghapus akun sendiri');
  }

  const user = await db.queryOne('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  if (!user) {
    return response.notFound(res, 'User tidak ditemukan');
  }

  // Hapus data terkait
  await db.query('DELETE FROM api_usage_logs WHERE user_id = ?', [id]);
  await db.query('DELETE FROM transactions WHERE user_id = ?', [id]);
  await db.query('DELETE FROM blacklist_entries WHERE user_id = ?', [id]);
  await db.query('DELETE FROM api_keys WHERE user_id = ?', [id]);
  await db.query('DELETE FROM password_resets WHERE user_id = ?', [id]);
  await db.query('DELETE FROM users WHERE id = ?', [id]);

  await logAdminAction(req.user.id, 'DELETE', 'user', id, user, null, req);

  return response.success(res, {
    message: 'User berhasil dihapus',
  });
}

// ==================== API KEYS MANAGEMENT ====================

/**
 * Mendapatkan semua API keys
 */
async function getAllApiKeys(req, res) {
  const pageNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 20;
  const user_id = req.query.user_id || '';
  const status = req.query.status || '';
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params = [];

  if (user_id) {
    whereClause += ' AND k.user_id = ?';
    params.push(user_id);
  }
  if (status === 'active') {
    whereClause += " AND k.status = 'ACTIVE'";
  } else if (status === 'inactive') {
    whereClause += " AND k.status = 'REVOKED'";
  }

  const countResult = await db.queryOne(
    `SELECT COUNT(*) as total FROM api_keys k WHERE ${whereClause}`,
    params
  );

  const keys = await db.query(
    `SELECT k.id, k.user_id, u.name as user_name, u.email as user_email,
            k.prefix, k.name, k.status, k.created_at, k.last_used_at
     FROM api_keys k
     JOIN users u ON k.user_id = u.id
     WHERE ${whereClause}
     ORDER BY k.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return response.success(res, {
    keys,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult.total || 0,
      totalPages: Math.ceil((countResult.total || 0) / limitNum),
    },
  });
}

/**
 * Toggle status API key
 */
async function toggleApiKey(req, res) {
  const { id } = req.params;

  const key = await db.queryOne('SELECT * FROM api_keys WHERE id = ?', [id]);
  if (!key) {
    return response.notFound(res, 'API key tidak ditemukan');
  }

  const newStatus = key.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
  await db.query('UPDATE api_keys SET status = ? WHERE id = ?', [newStatus, id]);

  await logAdminAction(
    req.user.id,
    newStatus === 'ACTIVE' ? 'ACTIVATE' : 'REVOKE',
    'api_key',
    id,
    { status: key.status },
    { status: newStatus },
    req
  );

  return response.success(res, {
    message: `API key berhasil ${newStatus === 'ACTIVE' ? 'diaktifkan' : 'direvoke'}`,
    status: newStatus,
  });
}

/**
 * Hapus API key
 */
async function deleteApiKey(req, res) {
  const { id } = req.params;

  const key = await db.queryOne('SELECT * FROM api_keys WHERE id = ?', [id]);
  if (!key) {
    return response.notFound(res, 'API key tidak ditemukan');
  }

  await db.query('DELETE FROM api_keys WHERE id = ?', [id]);

  await logAdminAction(req.user.id, 'DELETE', 'api_key', id, { name: key.name, user_id: key.user_id }, null, req);

  return response.success(res, {
    message: 'API key berhasil dihapus',
  });
}

// ==================== BLACKLIST MANAGEMENT ====================

/**
 * Mendapatkan semua blacklist entries
 */
async function getAllBlacklist(req, res) {
  const pageNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 20;
  const user_id = req.query.user_id || '';
  const type = req.query.type || '';
  const active = req.query.active || '';
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params = [];

  if (user_id) {
    whereClause += ' AND b.user_id = ?';
    params.push(user_id);
  }
  if (type) {
    whereClause += ' AND b.type = ?';
    params.push(type);
  }
  if (active !== '') {
    whereClause += ' AND b.active = ?';
    params.push(active === 'true');
  }

  const countResult = await db.queryOne(
    `SELECT COUNT(*) as total FROM blacklist_entries b WHERE ${whereClause}`,
    params
  );

  const entries = await db.query(
    `SELECT b.id, b.user_id, u.name as user_name, u.email as user_email,
            b.type, b.value, b.reason, b.active, b.created_at
     FROM blacklist_entries b
     JOIN users u ON b.user_id = u.id
     WHERE ${whereClause}
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return response.success(res, {
    entries,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult.total || 0,
      totalPages: Math.ceil((countResult.total || 0) / limitNum),
    },
  });
}

/**
 * Toggle blacklist entry
 */
async function toggleBlacklistEntry(req, res) {
  const { id } = req.params;

  const entry = await db.queryOne('SELECT * FROM blacklist_entries WHERE id = ?', [id]);
  if (!entry) {
    return response.notFound(res, 'Entry tidak ditemukan');
  }

  const newStatus = !entry.active;
  await db.query('UPDATE blacklist_entries SET active = ? WHERE id = ?', [newStatus, id]);

  await logAdminAction(
    req.user.id,
    newStatus ? 'ACTIVATE' : 'DEACTIVATE',
    'blacklist_entry',
    id,
    { active: entry.active },
    { active: newStatus },
    req
  );

  return response.success(res, {
    message: `Entry berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
    active: newStatus,
  });
}

/**
 * Hapus blacklist entry
 */
async function deleteBlacklistEntry(req, res) {
  const { id } = req.params;

  const entry = await db.queryOne('SELECT * FROM blacklist_entries WHERE id = ?', [id]);
  if (!entry) {
    return response.notFound(res, 'Entry tidak ditemukan');
  }

  await db.query('DELETE FROM blacklist_entries WHERE id = ?', [id]);

  await logAdminAction(req.user.id, 'DELETE', 'blacklist_entry', id, entry, null, req);

  return response.success(res, {
    message: 'Entry berhasil dihapus',
  });
}

// ==================== TRANSACTIONS & STATS ====================

/**
 * Mendapatkan semua transaksi
 */
async function getAllTransactions(req, res) {
  const pageNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 50;
  const user_id = req.query.user_id || '';
  const date_from = req.query.date_from || '';
  const date_to = req.query.date_to || '';
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params = [];

  if (user_id) {
    whereClause += ' AND k.user_id = ?';
    params.push(user_id);
  }
  if (date_from) {
    whereClause += ' AND t.created_at >= ?';
    params.push(date_from);
  }
  if (date_to) {
    whereClause += ' AND t.created_at <= ?';
    params.push(date_to + ' 23:59:59');
  }

  const countResult = await db.queryOne(
    `SELECT COUNT(*) as total FROM transactions t
     JOIN api_keys k ON t.api_key_id = k.id
     WHERE ${whereClause}`,
    params
  );

  const transactions = await db.query(
    `SELECT t.id, k.user_id, u.name as user_name, u.email as user_email,
            t.external_txn_id as transaction_id, t.amount, t.currency, 
            t.account_id, t.merchant_id, t.ip, t.country,
            t.risk_score, t.decision as risk_level, t.created_at
     FROM transactions t
     JOIN api_keys k ON t.api_key_id = k.id
     JOIN users u ON k.user_id = u.id
     WHERE ${whereClause}
     ORDER BY t.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return response.success(res, {
    transactions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult?.total || 0,
      totalPages: Math.ceil((countResult?.total || 0) / limitNum),
    },
  });
}

/**
 * Mendapatkan statistik global
 */
async function getGlobalStats(req, res) {
  const [users, apiKeys, blacklist, transactions, apiUsage] = await Promise.all([
    db.queryOne('SELECT COUNT(*) as total, SUM(role = "admin") as admins, SUM(status = "suspended") as suspended FROM users'),
    db.queryOne("SELECT COUNT(*) as total, SUM(status = 'ACTIVE') as active FROM api_keys"),
    db.queryOne('SELECT COUNT(*) as total, SUM(active = TRUE) as active FROM blacklist_entries'),
    db.queryOne(`
      SELECT 
        COUNT(*) as total,
        AVG(risk_score) as avg_score,
        SUM(decision = 'APPROVE') as approve,
        SUM(decision = 'REVIEW') as review,
        SUM(decision = 'DECLINE') as decline
      FROM transactions
    `),
    db.queryOne(`
      SELECT 
        COUNT(*) as total,
        SUM(DATE(created_at) = CURDATE()) as today,
        SUM(created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as last_7_days
      FROM api_usage_logs
    `),
  ]);

  // Top users by API usage
  const topUsers = await db.query(`
    SELECT u.id, u.name, u.email, COUNT(l.id) as request_count
    FROM users u
    LEFT JOIN api_usage_logs l ON u.id = l.user_id
    GROUP BY u.id
    ORDER BY request_count DESC
    LIMIT 10
  `);

  // Recent audit logs
  const recentAuditLogs = await db.query(`
    SELECT a.*, u.name as admin_name
    FROM admin_audit_logs a
    JOIN users u ON a.admin_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 20
  `);

  return response.success(res, {
    users: {
      total: users?.total || 0,
      admins: users?.admins || 0,
      suspended: users?.suspended || 0,
    },
    api_keys: {
      total: apiKeys?.total || 0,
      active: apiKeys?.active || 0,
    },
    blacklist: {
      total: blacklist?.total || 0,
      active: blacklist?.active || 0,
    },
    transactions: {
      total: transactions?.total || 0,
      avg_score: transactions?.avg_score ? parseFloat(transactions.avg_score).toFixed(2) : 0,
      by_decision: {
        approve: transactions?.approve || 0,
        review: transactions?.review || 0,
        decline: transactions?.decline || 0,
      },
    },
    api_usage: {
      total: apiUsage?.total || 0,
      today: apiUsage?.today || 0,
      last_7_days: apiUsage?.last_7_days || 0,
    },
    top_users: topUsers || [],
    recent_audit_logs: recentAuditLogs || [],
  });
}

/**
 * Mendapatkan audit logs
 */
async function getAuditLogs(req, res) {
  const pageNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 50;
  const admin_id = req.query.admin_id || '';
  const action = req.query.action || '';
  const entity_type = req.query.entity_type || '';
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params = [];

  if (admin_id) {
    whereClause += ' AND a.admin_id = ?';
    params.push(admin_id);
  }
  if (action) {
    whereClause += ' AND a.action = ?';
    params.push(action);
  }
  if (entity_type) {
    whereClause += ' AND a.entity_type = ?';
    params.push(entity_type);
  }

  const countResult = await db.queryOne(
    `SELECT COUNT(*) as total FROM admin_audit_logs a WHERE ${whereClause}`,
    params
  );

  const logs = await db.query(
    `SELECT a.*, u.name as admin_name, u.email as admin_email
     FROM admin_audit_logs a
     JOIN users u ON a.admin_id = u.id
     WHERE ${whereClause}
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return response.success(res, {
    logs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult.total || 0,
      totalPages: Math.ceil((countResult.total || 0) / limitNum),
    },
  });
}

module.exports = {
  // Users
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // API Keys
  getAllApiKeys,
  toggleApiKey,
  deleteApiKey,
  // Blacklist
  getAllBlacklist,
  toggleBlacklistEntry,
  deleteBlacklistEntry,
  // Transactions & Stats
  getAllTransactions,
  getGlobalStats,
  getAuditLogs,
};
