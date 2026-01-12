const config = require('../config/env');
const blacklistService = require('./blacklist.service');
const transactionService = require('./transaction.service');
const { generateUuid } = require('../utils/crypto');

/**
 * Menghitung skor risiko dan menentukan keputusan untuk transaksi
 * @param {Object} params - Parameter penilaian
 * @returns {Promise<Object>} Hasil penilaian
 */
async function scoreTransaction(params) {
  const {
    apiKeyId,
    userId,
    externalTxnId,
    accountId,
    amount,
    currency,
    availableBalance,
    merchantId,
    ip,
    country,
    timestamp: providedTimestamp,
  } = params;

  const requestId = generateUuid();
  const timestamp = providedTimestamp ? new Date(providedTimestamp) : new Date();
  const triggeredRules = [];
  let riskScore = 0;
  let hardDecline = false;

  // Aturan 1: Pengecekan Blacklist
  const blacklistMatches = await blacklistService.checkMultipleBlacklist(userId, {
    account_id: accountId,
    merchant_id: merchantId,
    ip: ip,
    country: country,
  });

  if (blacklistMatches.length > 0) {
    hardDecline = true;
    for (const match of blacklistMatches) {
      triggeredRules.push({
        rule: 'BLACKLIST',
        severity: 'CRITICAL',
        reason: `${match.type} "${match.value}" is blacklisted: ${match.reason || 'No reason provided'}`,
      });
    }
  }

  // Aturan 2: Pengecekan Saldo Tidak Mencukupi
  if (amount > availableBalance) {
    hardDecline = true;
    triggeredRules.push({
      rule: 'INSUFFICIENT_FUNDS',
      severity: 'CRITICAL',
      reason: `Transaction amount (${amount}) exceeds available balance (${availableBalance})`,
    });
  }

  // Aturan 3: Pengecekan Velocity (transaksi dalam 5 menit terakhir)
  const velocityCount = await transactionService.getVelocityCount(
    apiKeyId,
    accountId,
    config.scoring.velocityWindow
  );

  if (velocityCount > config.scoring.velocityThresholdHigh) {
    riskScore += config.scoring.velocityRiskHigh;
    triggeredRules.push({
      rule: 'VELOCITY',
      severity: 'HIGH',
      reason: `High velocity: ${velocityCount} transactions in last 5 minutes (threshold: ${config.scoring.velocityThresholdHigh})`,
    });
  } else if (velocityCount > config.scoring.velocityThresholdMedium) {
    riskScore += config.scoring.velocityRiskMedium;
    triggeredRules.push({
      rule: 'VELOCITY',
      severity: 'MEDIUM',
      reason: `Medium velocity: ${velocityCount} transactions in last 5 minutes (threshold: ${config.scoring.velocityThresholdMedium})`,
    });
  }

  // Aturan 4: Pengecekan Limit Harian
  const dailySum = await transactionService.getDailySum(apiKeyId, accountId);
  const projectedDaily = dailySum + amount;

  if (projectedDaily > config.scoring.dailyLimitHigh) {
    riskScore += config.scoring.dailyLimitRiskHigh;
    triggeredRules.push({
      rule: 'DAILY_LIMIT',
      severity: 'HIGH',
      reason: `Projected daily total (${projectedDaily}) exceeds high threshold (${config.scoring.dailyLimitHigh})`,
    });
  } else if (projectedDaily > config.scoring.dailyLimitMedium) {
    riskScore += config.scoring.dailyLimitRiskMedium;
    triggeredRules.push({
      rule: 'DAILY_LIMIT',
      severity: 'MEDIUM',
      reason: `Projected daily total (${projectedDaily}) exceeds medium threshold (${config.scoring.dailyLimitMedium})`,
    });
  }

  // Menentukan keputusan akhir
  let decision;
  if (hardDecline) {
    decision = 'DECLINE';
    riskScore = Math.max(riskScore, 90);
  } else if (riskScore >= config.scoring.declineThreshold) {
    decision = 'DECLINE';
  } else if (riskScore >= config.scoring.reviewThreshold) {
    decision = 'REVIEW';
  } else {
    decision = 'APPROVE';
  }

  // Menyimpan catatan transaksi
  await transactionService.createTransaction({
    apiKeyId,
    externalTxnId,
    accountId,
    amount,
    currency,
    availableBalance,
    merchantId,
    ip,
    country,
    timestamp,
    riskScore,
    decision,
    triggeredRules,
  });

  return {
    request_id: requestId,
    decision,
    risk_score: riskScore,
    triggered_rules: triggeredRules,
    processed_at: new Date().toISOString(),
  };
}

module.exports = {
  scoreTransaction,
};
