const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authJwt } = require('../middleware/authJwt');
const { asyncHandler } = require('../middleware/errorHandler');

// Semua route memerlukan autentikasi JWT
router.use(authJwt);

// GET /stats/dashboard - Statistik untuk dashboard
router.get('/dashboard', asyncHandler(statsController.getDashboard));

// GET /stats/transactions - Transaksi terbaru
router.get('/transactions', asyncHandler(statsController.getRecentTransactions));

// GET /stats/daily - Penggunaan harian untuk chart
router.get('/daily', asyncHandler(statsController.getDailyUsage));

// GET /stats/endpoints - Statistik per endpoint
router.get('/endpoints', asyncHandler(statsController.getEndpointStats));

// GET /stats/usage - Usage summary
router.get('/usage', asyncHandler(statsController.getUsageSummary));

module.exports = router;
