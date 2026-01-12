const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authJwt } = require('../middleware/authJwt');
const requireAdmin = require('../middleware/requireAdmin');

// Semua route admin memerlukan autentikasi dan role admin
router.use(authJwt);
router.use(requireAdmin);

// ==================== USER MANAGEMENT ====================
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ==================== API KEYS MANAGEMENT ====================
router.get('/keys', adminController.getAllApiKeys);
router.patch('/keys/:id/toggle', adminController.toggleApiKey);
router.delete('/keys/:id', adminController.deleteApiKey);

// ==================== BLACKLIST MANAGEMENT ====================
router.get('/blacklist', adminController.getAllBlacklist);
router.patch('/blacklist/:id/toggle', adminController.toggleBlacklistEntry);
router.delete('/blacklist/:id', adminController.deleteBlacklistEntry);

// ==================== TRANSACTIONS ====================
router.get('/transactions', adminController.getAllTransactions);

// ==================== STATS & AUDIT ====================
router.get('/stats', adminController.getGlobalStats);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
