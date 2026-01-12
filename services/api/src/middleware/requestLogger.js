const { logApiUsage } = require('../services/stats.service');

function getEndpoint(req) {
  const baseUrl = req.baseUrl || '';
  const routePath = req.route?.path;

  if (routePath && routePath !== '/') {
    return `${baseUrl}${routePath}`;
  }

  if (baseUrl) {
    return baseUrl;
  }

  return (req.originalUrl || '').split('?')[0];
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return String(forwardedFor[0]).split(',')[0].trim();
  }
  return req.ip || null;
}

/**
 * Request logger untuk mengisi `api_usage_logs`.
 * Saat ini hanya melog request yang memakai API Key (mis. /v1/score)
 * supaya metrik "Total Request" merepresentasikan pemakaian API scoring.
 */
function requestLogger(req, res, next) {
  const startNs = process.hrtime.bigint();

  res.on('finish', () => {
    const apiKey = req.apiKey;
    if (!apiKey?.userId) return;

    const durationMs = Number((process.hrtime.bigint() - startNs) / 1000000n);

    logApiUsage(
      apiKey.userId,
      apiKey.id,
      getEndpoint(req),
      req.method,
      res.statusCode,
      durationMs,
      getClientIp(req)
    ).catch((err) => {
      console.error('Gagal mencatat api_usage_logs:', err);
    });
  });

  next();
}

module.exports = {
  requestLogger,
};
