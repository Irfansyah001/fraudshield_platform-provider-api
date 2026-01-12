const blacklistService = require('../services/blacklist.service');
const response = require('../utils/response');

/**
 * Membuat entri blacklist baru
 */
async function createEntry(req, res) {
  const userId = req.user.id;
  const { type, value, reason } = req.body;

  try {
    const entry = await blacklistService.createEntry(userId, { type, value, reason });
    return response.created(res, entry);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.conflict(res, `Blacklist entry for ${type} "${value}" already exists`);
    }
    throw error;
  }
}

/**
 * Menampilkan daftar entri blacklist dengan filter opsional
 */
async function listEntries(req, res) {
  const userId = req.user.id;
  const { type, active } = req.query;

  const entries = await blacklistService.listEntries(userId, { type, active });

  return response.success(res, { entries });
}

/**
 * Mengambil satu entri blacklist
 */
async function getEntry(req, res) {
  const userId = req.user.id;
  const entryId = parseInt(req.params.id, 10);

  if (isNaN(entryId)) {
    return response.badRequest(res, 'ID entri tidak valid');
  }

  const entry = await blacklistService.getEntryById(entryId, userId);

  if (!entry) {
    return response.notFound(res, 'Entri blacklist tidak ditemukan');
  }

  return response.success(res, entry);
}

/**
 * Memperbarui entri blacklist
 */
async function updateEntry(req, res) {
  const userId = req.user.id;
  const entryId = parseInt(req.params.id, 10);

  if (isNaN(entryId)) {
    return response.badRequest(res, 'ID entri tidak valid');
  }

  // Mengecek apakah entri ada
  const existing = await blacklistService.getEntryById(entryId, userId);
  if (!existing) {
    return response.notFound(res, 'Entri blacklist tidak ditemukan');
  }

  try {
    const entry = await blacklistService.updateEntry(entryId, userId, req.body);
    return response.success(res, entry);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.conflict(res, 'Blacklist entry with this type and value already exists');
    }
    throw error;
  }
}

/**
 * Menghapus entri blacklist
 */
async function deleteEntry(req, res) {
  const userId = req.user.id;
  const entryId = parseInt(req.params.id, 10);

  if (isNaN(entryId)) {
    return response.badRequest(res, 'ID entri tidak valid');
  }

  const success = await blacklistService.deleteEntry(entryId, userId);

  if (!success) {
    return response.notFound(res, 'Entri blacklist tidak ditemukan');
  }

  return response.noContent(res);
}

module.exports = {
  createEntry,
  listEntries,
  getEntry,
  updateEntry,
  deleteEntry,
};
