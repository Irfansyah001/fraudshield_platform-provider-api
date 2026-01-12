const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/crypto');
const { generateToken } = require('../middleware/authJwt');
const response = require('../utils/response');
const crypto = require('crypto');
const { validatePassword } = require('../utils/validators');

/**
 * Mendaftarkan user baru
 */
async function register(req, res) {
  const { name, email, password, role } = req.body;

  console.log('[auth.register] Menerima request:', { name, email, role_received: role });

  // Mengecek apakah email sudah terdaftar
  const existingUser = await db.queryOne(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser) {
    return response.conflict(res, 'Email sudah terdaftar');
  }

  // Validasi role (hanya 'user' atau 'admin' yang diizinkan)
  const validRole = ['user', 'admin'].includes(role) ? role : 'user';
  console.log('[auth.register] Role yang digunakan:', validRole);

  // Meng-hash password dan membuat user
  const passwordHash = await hashPassword(password);
  const userId = await db.insert(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, validRole]
  );

  // Mengambil data user yang dibuat
  const user = await db.queryOne(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  console.log('[auth.register] User dibuat:', { id: user.id, role: user.role });

  // Membuat token
  const token = generateToken(user);

  return response.created(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
    access_token: token,
    token_type: 'Bearer',
  });
}

/**
 * Login user
 */
async function login(req, res) {
  const { email, password } = req.body;

  // Mencari user berdasarkan email
  const user = await db.queryOne(
    'SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    return response.unauthorized(res, 'Email atau password tidak valid');
  }

  // Cek apakah user suspended
  if (user.status === 'suspended') {
    return response.forbidden(res, 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
  }

  // Memverifikasi password
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return response.unauthorized(res, 'Email atau password tidak valid');
  }

  // Membuat token
  const token = generateToken(user);

  return response.success(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
    access_token: token,
    token_type: 'Bearer',
  });
}

/**
 * Request password reset (untuk testing, mengembalikan token langsung)
 * Di production, token akan dikirim via email
 */
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return response.badRequest(res, 'Email wajib diisi');
  }

  // Cari user
  const user = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);

  // Selalu kembalikan sukses (untuk keamanan, jangan bocorkan apakah email terdaftar)
  if (!user) {
    return response.success(res, {
      message: 'Jika email terdaftar, link reset password akan dikirim',
    });
  }

  // Generate token reset
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 jam

  // Tandai token lama sebagai used
  await db.query(
    'UPDATE password_resets SET used = TRUE WHERE user_id = ? AND used = FALSE',
    [user.id]
  );

  // Simpan token baru
  await db.insert(
    'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, resetToken, expiresAt]
  );

  // Untuk development/testing, kembalikan token langsung
  // Di production, kirim via email dan hapus token dari response
  return response.success(res, {
    message: 'Jika email terdaftar, link reset password akan dikirim',
    // Token hanya untuk testing, hapus di production
    reset_token: resetToken,
    expires_at: expiresAt,
    note: 'Untuk testing: gunakan token ini di endpoint /auth/reset-password',
  });
}

/**
 * Reset password dengan token
 */
async function resetPassword(req, res) {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return response.badRequest(res, 'Token dan password baru wajib diisi');
  }

  // Validasi password baru
  const passwordValidation = validatePassword(new_password);
  if (!passwordValidation.valid) {
    return response.badRequest(res, passwordValidation.message);
  }

  // Cari token yang valid
  const resetRecord = await db.queryOne(
    `SELECT pr.id, pr.user_id FROM password_resets pr
     WHERE pr.token = ? AND pr.used = FALSE AND pr.expires_at > NOW()`,
    [token]
  );

  if (!resetRecord) {
    return response.badRequest(res, 'Token tidak valid atau sudah kadaluarsa');
  }

  // Hash password baru
  const passwordHash = await hashPassword(new_password);

  // Update password
  await db.query(
    'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
    [passwordHash, resetRecord.user_id]
  );

  // Tandai token sebagai used
  await db.query('UPDATE password_resets SET used = TRUE WHERE id = ?', [resetRecord.id]);

  return response.success(res, {
    message: 'Password berhasil direset. Silakan login dengan password baru.',
  });
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
