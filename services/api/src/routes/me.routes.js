const express = require('express');
const router = express.Router();
const meController = require('../controllers/me.controller');
const { authJwt } = require('../middleware/authJwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * /me:
 *   get:
 *     tags: [User]
 *     summary: Get current user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', authJwt, asyncHandler(meController.getProfile));

/**
 * @swagger
 * /me:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/', authJwt, asyncHandler(meController.updateProfile));

// Backward/forward compatibility: allow PATCH for profile updates
router.patch('/', authJwt, asyncHandler(meController.updateProfile));

/**
 * @swagger
 * /me/password:
 *   put:
 *     tags: [User]
 *     summary: Change user password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Invalid password
 *       401:
 *         description: Unauthorized
 */
router.put('/password', authJwt, asyncHandler(meController.changePassword));

// Backward/forward compatibility: allow PATCH for password changes
router.patch('/password', authJwt, asyncHandler(meController.changePassword));

module.exports = router;
