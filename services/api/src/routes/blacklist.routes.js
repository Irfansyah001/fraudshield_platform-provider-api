const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklist.controller');
const { authJwt } = require('../middleware/authJwt');
const { validateBody, createBlacklistSchema, updateBlacklistSchema } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * /blacklist:
 *   post:
 *     tags: [Blacklist]
 *     summary: Create a new blacklist entry
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - value
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ACCOUNT_ID, MERCHANT_ID, IP, COUNTRY]
 *                 example: ACCOUNT_ID
 *               value:
 *                 type: string
 *                 example: fraudster_123
 *               reason:
 *                 type: string
 *                 example: Known fraudster account
 *     responses:
 *       201:
 *         description: Blacklist entry created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Entry already exists
 */
router.post('/', authJwt, validateBody(createBlacklistSchema), asyncHandler(blacklistController.createEntry));

/**
 * @swagger
 * /blacklist:
 *   get:
 *     tags: [Blacklist]
 *     summary: List blacklist entries
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ACCOUNT_ID, MERCHANT_ID, IP, COUNTRY]
 *         description: Filter by type
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of blacklist entries
 *       401:
 *         description: Unauthorized
 */
router.get('/', authJwt, asyncHandler(blacklistController.listEntries));

/**
 * @swagger
 * /blacklist/{id}:
 *   get:
 *     tags: [Blacklist]
 *     summary: Get a blacklist entry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blacklist entry ID
 *     responses:
 *       200:
 *         description: Blacklist entry details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Entry not found
 */
router.get('/:id', authJwt, asyncHandler(blacklistController.getEntry));

/**
 * @swagger
 * /blacklist/{id}:
 *   put:
 *     tags: [Blacklist]
 *     summary: Update a blacklist entry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blacklist entry ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ACCOUNT_ID, MERCHANT_ID, IP, COUNTRY]
 *               value:
 *                 type: string
 *               reason:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated blacklist entry
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Entry not found
 */
router.put('/:id', authJwt, validateBody(updateBlacklistSchema), asyncHandler(blacklistController.updateEntry));

/**
 * @swagger
 * /blacklist/{id}:
 *   delete:
 *     tags: [Blacklist]
 *     summary: Delete a blacklist entry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blacklist entry ID
 *     responses:
 *       204:
 *         description: Entry deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', authJwt, asyncHandler(blacklistController.deleteEntry));

module.exports = router;
