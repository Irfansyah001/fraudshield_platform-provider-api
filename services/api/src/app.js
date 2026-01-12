const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { sanitizeInput, detectXSSAttack } = require('./middleware/sanitizer');
const { requestLogger } = require('./middleware/requestLogger');

// Mengimpor routes
const authRoutes = require('./routes/auth.routes');
const meRoutes = require('./routes/me.routes');
const keysRoutes = require('./routes/keys.routes');
const blacklistRoutes = require('./routes/blacklist.routes');
const scoreRoutes = require('./routes/score.routes');
const statsRoutes = require('./routes/stats.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware keamanan
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  // Menambahkan header keamanan tambahan
  hsts: {
    maxAge: 31536000, // 1 tahun
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  xssFilter: true,
}));

// Konfigurasi CORS
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
}));

// Parsing body request
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Deteksi XSS lebih dulu (cek payload asli), baru sanitasi
app.use(detectXSSAttack);
app.use(sanitizeInput);

// Mencatat usage untuk request berbasis API Key (mis. /v1/score)
app.use(requestLogger);

// Pembatasan request untuk endpoint publik
const publicLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Terlalu banyak request, silakan coba lagi nanti',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Konfigurasi Swagger/OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FraudShield API',
      version: '1.0.0',
      description: 'Real-time fraud detection and scoring API for developers',
      contact: {
        name: 'FraudShield Support',
        email: 'support@fraudshield.io',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for developer portal authentication',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for fraud scoring endpoint',
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Developer account authentication' },
      { name: 'User', description: 'User profile management' },
      { name: 'API Keys', description: 'API key management' },
      { name: 'Blacklist', description: 'Blacklist entry management (CRUD)' },
      { name: 'Fraud Scoring', description: 'Public fraud scoring endpoint' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Endpoint pengecekan kesehatan server
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Dokumentasi API
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FraudShield API Documentation',
}));

// JSON spesifikasi API
app.get('/docs/json', (req, res) => {
  res.json(swaggerSpec);
});

// Memasang routes
app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/keys', keysRoutes);
app.use('/blacklist', blacklistRoutes);
app.use('/stats', statsRoutes);
app.use('/admin', adminRoutes);
app.use('/v1/score', publicLimiter, scoreRoutes);

// Backward compatibility alias
app.use('/score', publicLimiter, scoreRoutes);

// Handler 404
app.use(notFoundHandler);

// Handler error
app.use(errorHandler);

module.exports = app;
