const db = require('../config/db');
const { compareApiKey } = require('../utils/crypto');
const response = require('../utils/response');

/**
 * Middleware Autentikasi API Key
 * Memvalidasi header X-API-Key dan melampirkan info API key ke request
 */
async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return response.unauthorized(res, 'Header X-API-Key diperlukan');
  }

  try {
    // Mengekstrak prefix dari key yang diberikan
    const prefix = apiKey.substring(0, 12);

    // Mencari key yang cocok berdasarkan prefix (untuk efisiensi)
    const keys = await db.query(
      `SELECT ak.id, ak.user_id, ak.key_hash, ak.status, ak.name, u.id as owner_id
       FROM api_keys ak
       JOIN users u ON ak.user_id = u.id
       WHERE ak.prefix = ? AND ak.status = 'ACTIVE'`,
      [prefix]
    );

    if (keys.length === 0) {
      return response.unauthorized(res, 'API key tidak valid');
    }

    // Mencari key yang cocok menggunakan perbandingan waktu konstan
    let matchedKey = null;
    for (const key of keys) {
      if (compareApiKey(apiKey, key.key_hash)) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return response.unauthorized(res, 'API key tidak valid');
    }

    // Melampirkan info API key ke request
    req.apiKey = {
      id: matchedKey.id,
      userId: matchedKey.user_id,
      name: matchedKey.name,
    };

    // Memperbarui last_used_at secara asinkron (tidak menunggu hasilnya)
    db.execute(
      'UPDATE api_keys SET last_used_at = NOW() WHERE id = ?',
      [matchedKey.id]
    ).catch(err => console.error('Gagal memperbarui last_used_at:', err));

    next();
  } catch (err) {
    console.error('Error autentikasi API key:', err);
    return response.serverError(res, 'Terjadi kesalahan autentikasi');
  }
}

module.exports = {
  apiKeyAuth,
};
