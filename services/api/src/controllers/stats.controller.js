const statsService = require('../services/stats.service');
const { success, error } = require('../utils/response');

/**
 * Mengambil statistik dashboard
 * GET /stats/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const stats = await statsService.getDashboardStats(userId);
    success(res, stats);
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil transaksi terbaru
 * GET /stats/transactions
 */
async function getRecentTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await statsService.getRecentTransactions(userId, limit);
    success(res, { transactions });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil penggunaan harian
 * GET /stats/daily
 */
async function getDailyUsage(req, res, next) {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;
    const usage = await statsService.getDailyUsage(userId, days);
    success(res, { usage });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil statistik per endpoint
 * GET /stats/endpoints
 */
async function getEndpointStats(req, res, next) {
  try {
    const userId = req.user.id;
    const endpoints = await statsService.getEndpointStats(userId);
    success(res, { endpoints });
  } catch (err) {
    next(err);
  }
}

/**
 * Mengambil usage summary
 * GET /stats/usage
 */
async function getUsageSummary(req, res, next) {
  try {
    const userId = req.user.id;
    const period = req.query.period || '7d';
    const summary = await statsService.getUsageSummary(userId, period);
    success(res, summary);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getRecentTransactions,
  getDailyUsage,
  getEndpointStats,
  getUsageSummary,
};
