const keyService = require('../services/key.service');
const response = require('../utils/response');

/**
 * Membuat API key baru
 */
async function createKey(req, res) {
  const userId = req.user.id;
  const { name } = req.body;

  const key = await keyService.createKey(userId, name);

  return response.created(res, key);
}

/**
 * Menampilkan daftar semua API key untuk user
 */
async function listKeys(req, res) {
  const userId = req.user.id;

  const keys = await keyService.listKeys(userId);

  return response.success(res, { keys });
}

/**
 * Mencabut API key
 */
async function revokeKey(req, res) {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id, 10);

  if (isNaN(keyId)) {
    return response.badRequest(res, 'ID key tidak valid');
  }

  // Mengecek apakah key ada dan milik user
  const key = await keyService.getKeyById(keyId, userId);
  if (!key) {
    return response.notFound(res, 'API key tidak ditemukan');
  }

  if (key.status === 'REVOKED') {
    return response.badRequest(res, 'API key sudah dicabut');
  }

  const success = await keyService.revokeKey(keyId, userId);
  if (!success) {
    return response.serverError(res, 'Gagal mencabut API key');
  }

  return response.success(res, { 
    message: 'API key berhasil dicabut',
    id: keyId,
    status: 'REVOKED',
  });
}

module.exports = {
  createKey,
  listKeys,
  revokeKey,
};
