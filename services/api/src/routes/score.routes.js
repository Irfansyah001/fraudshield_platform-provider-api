const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/score.controller');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const { validateBody, scoreRequestSchema } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * /v1/score:
 *   post:
 *     tags: [Fraud Scoring]
 *     summary: Score a transaction for fraud risk
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_txn_id
 *               - account_id
 *               - amount
 *               - currency
 *               - available_balance
 *             properties:
 *               external_txn_id:
 *                 type: string
 *                 description: Your unique transaction identifier
 *                 example: txn_abc123
 *               account_id:
 *                 type: string
 *                 description: Customer account identifier
 *                 example: acc_user456
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *                 example: 150.00
 *               currency:
 *                 type: string
 *                 description: Currency code
 *                 example: USD
 *               available_balance:
 *                 type: number
 *                 description: Account available balance
 *                 example: 500.00
 *               merchant_id:
 *                 type: string
 *                 description: Merchant identifier
 *                 example: merchant_789
 *               ip:
 *                 type: string
 *                 description: Customer IP address
 *                 example: 192.168.1.1
 *               country:
 *                 type: string
 *                 description: Country code
 *                 example: US
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Transaction timestamp (ISO 8601)
 *                 example: 2025-01-11T10:30:00Z
 *     responses:
 *       200:
 *         description: Fraud score result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 request_id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique request identifier
 *                 decision:
 *                   type: string
 *                   enum: [APPROVE, REVIEW, DECLINE]
 *                   description: Recommended action
 *                 risk_score:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 100
 *                   description: Risk score (0-100)
 *                 triggered_rules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rule:
 *                         type: string
 *                       severity:
 *                         type: string
 *                         enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                       reason:
 *                         type: string
 *                 processed_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid or missing API key
 */
router.post('/', apiKeyAuth, validateBody(scoreRequestSchema), asyncHandler(scoreController.scoreTransaction));

module.exports = router;
