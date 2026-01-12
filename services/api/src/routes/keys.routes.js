const express = require('express');
const router = express.Router();
const keysController = require('../controllers/keys.controller');
const { authJwt } = require('../middleware/authJwt');
const { validateBody, createKeySchema } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * /keys:
 *   post:
 *     tags: [API Keys]
 *     summary: Create a new API key
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Production Key
 *     responses:
 *       201:
 *         description: API key created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 prefix:
 *                   type: string
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 api_key:
 *                   type: string
 *                   description: Full API key (only shown once)
 *       401:
 *         description: Unauthorized
 */
router.post('/', authJwt, validateBody(createKeySchema), asyncHandler(keysController.createKey));

/**
 * @swagger
 * /keys:
 *   get:
 *     tags: [API Keys]
 *     summary: List all API keys
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keys:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       prefix:
 *                         type: string
 *                       status:
 *                         type: string
 *                       last_used_at:
 *                         type: string
 *                         format: date-time
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', authJwt, asyncHandler(keysController.listKeys));

/**
 * @swagger
 * /keys/{id}:
 *   delete:
 *     tags: [API Keys]
 *     summary: Revoke an API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key revoked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: API key not found
 */
router.delete('/:id', authJwt, asyncHandler(keysController.revokeKey));

module.exports = router;
