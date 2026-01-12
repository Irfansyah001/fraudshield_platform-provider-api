const db = require('../config/db');
const response = require('../utils/response');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validators');

/**
 * Mengambil profil user saat ini
 */
async function getProfile(req, res) {
  const userId = req.user.id;

  const user = await db.queryOne(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    return response.notFound(res, 'User not found');
  }

  return response.success(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });
}

/**
 * Update profil user (nama)
 */
async function updateProfile(req, res) {
  const userId = req.user.id;
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return response.badRequest(res, 'Nama harus minimal 2 karakter');
  }

  await db.query('UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?', [name.trim(), userId]);

  const user = await db.queryOne(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [userId]
  );

  return response.success(res, {
    message: 'Profil berhasil diperbarui',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
}

/**
 * Ubah password user
 */
async function changePassword(req, res) {
  const userId = req.user.id;

  // Support both snake_case (API docs) and camelCase (some clients)
  const current_password = req.body.current_password ?? req.body.currentPassword;
  const new_password = req.body.new_password ?? req.body.newPassword;

  if (!current_password || !new_password) {
    return response.badRequest(res, 'Password lama dan baru wajib diisi');
  }

  // Validasi password baru
  const passwordValidation = validatePassword(new_password);
  if (!passwordValidation.valid) {
    return response.badRequest(res, passwordValidation.message);
  }

  // Ambil password hash saat ini
  const user = await db.queryOne('SELECT password_hash FROM users WHERE id = ?', [userId]);
  if (!user) {
    return response.notFound(res, 'User not found');
  }

  // Verifikasi password lama
  const isValid = await bcrypt.compare(current_password, user.password_hash);
  if (!isValid) {
    return response.unauthorized(res, 'Password lama tidak valid');
  }

  // Hash password baru
  const newHash = await bcrypt.hash(new_password, 10);
  await db.query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [newHash, userId]);

  return response.success(res, {
    message: 'Password berhasil diubah',
  });
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
