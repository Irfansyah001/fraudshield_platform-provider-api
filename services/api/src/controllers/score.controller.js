const scoringService = require('../services/scoring.service');
const response = require('../utils/response');

/**
 * Menilai risiko transaksi
 */
async function scoreTransaction(req, res) {
  const { id: apiKeyId, userId } = req.apiKey;
  const {
    external_txn_id,
    account_id,
    amount,
    currency,
    available_balance,
    merchant_id,
    ip,
    country,
    timestamp,
  } = req.body;

  const result = await scoringService.scoreTransaction({
    apiKeyId,
    userId,
    externalTxnId: external_txn_id,
    accountId: account_id,
    amount,
    currency,
    availableBalance: available_balance,
    merchantId: merchant_id,
    ip,
    country,
    timestamp,
  });

  return response.success(res, result);
}

module.exports = {
  scoreTransaction,
};
