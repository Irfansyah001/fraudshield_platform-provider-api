const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { authJwt } = require('../middleware/authJwt');
const requireAdmin = require('../middleware/requireAdmin');
const { asyncHandler } = require('../middleware/errorHandler');

// Semua route admin memerlukan autentikasi dan role admin
router.use(authJwt);
router.use(requireAdmin);

// ==================== USER MANAGEMENT ====================
router.get('/users', asyncHandler(adminController.getUsers));
router.get('/users/:id', asyncHandler(adminController.getUserById));
router.post('/users', asyncHandler(adminController.createUser));
router.put('/users/:id', asyncHandler(adminController.updateUser));
router.patch('/users/:id', asyncHandler(adminController.updateUser));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

// ==================== API KEYS MANAGEMENT ====================
router.get('/keys', asyncHandler(adminController.getAllApiKeys));
router.patch('/keys/:id/toggle', asyncHandler(adminController.toggleApiKey));
router.delete('/keys/:id', asyncHandler(adminController.deleteApiKey));

// ==================== BLACKLIST MANAGEMENT ====================
router.get('/blacklist', asyncHandler(adminController.getAllBlacklist));
router.patch('/blacklist/:id/toggle', asyncHandler(adminController.toggleBlacklistEntry));
router.delete('/blacklist/:id', asyncHandler(adminController.deleteBlacklistEntry));

// ==================== TRANSACTIONS ====================
router.get('/transactions', asyncHandler(adminController.getAllTransactions));

// ==================== STATS & AUDIT ====================
router.get('/stats', asyncHandler(adminController.getGlobalStats));
router.get('/audit-logs', asyncHandler(adminController.getAuditLogs));

module.exports = router;
