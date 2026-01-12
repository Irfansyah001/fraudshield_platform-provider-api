const Joi = require('joi');

// Regex untuk password yang kuat:
// - Minimal 8 karakter
// - Minimal 1 huruf kecil
// - Minimal 1 huruf besar
// - Minimal 1 angka
// - Minimal 1 karakter spesial
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validator untuk Autentikasi
const registerSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'string.max': 'Nama maksimal 255 karakter',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(8).pattern(passwordPattern).required().messages({
    'string.min': 'Password minimal 8 karakter',
    'string.pattern.base': 'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter spesial (@$!%*?&)',
    'any.required': 'Password wajib diisi',
  }),
  role: Joi.string().valid('user', 'admin').default('user').messages({
    'any.only': 'Role harus user atau admin',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi',
  }),
});

// Validator untuk API Key
const createKeySchema = Joi.object({
  name: Joi.string().max(255).default('Default Key').messages({
    'string.max': 'Key name must be less than 255 characters',
  }),
});

// Validator untuk Blacklist
const blacklistTypeEnum = ['ACCOUNT_ID', 'MERCHANT_ID', 'IP', 'COUNTRY'];

const createBlacklistSchema = Joi.object({
  type: Joi.string().valid(...blacklistTypeEnum).required().messages({
    'any.only': `Type must be one of: ${blacklistTypeEnum.join(', ')}`,
    'any.required': 'Type is required',
  }),
  value: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Value is required',
    'string.max': 'Value must be less than 255 characters',
    'any.required': 'Value is required',
  }),
  reason: Joi.string().max(1000).allow('', null).messages({
    'string.max': 'Reason must be less than 1000 characters',
  }),
});

const updateBlacklistSchema = Joi.object({
  type: Joi.string().valid(...blacklistTypeEnum).messages({
    'any.only': `Type must be one of: ${blacklistTypeEnum.join(', ')}`,
  }),
  value: Joi.string().min(1).max(255).messages({
    'string.empty': 'Value cannot be empty',
    'string.max': 'Value must be less than 255 characters',
  }),
  reason: Joi.string().max(1000).allow('', null).messages({
    'string.max': 'Reason must be less than 1000 characters',
  }),
  active: Joi.boolean(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// Validator untuk Score Request
const scoreRequestSchema = Joi.object({
  external_txn_id: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'external_txn_id is required',
    'any.required': 'external_txn_id is required',
  }),
  account_id: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'account_id is required',
    'any.required': 'account_id is required',
  }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'amount must be a positive number',
    'any.required': 'amount is required',
  }),
  currency: Joi.string().min(1).max(10).required().messages({
    'string.empty': 'currency is required',
    'any.required': 'currency is required',
  }),
  available_balance: Joi.number().min(0).required().messages({
    'number.min': 'available_balance must be non-negative',
    'any.required': 'available_balance is required',
  }),
  merchant_id: Joi.string().max(255).allow('', null),
  ip: Joi.string().max(45).allow('', null),
  country: Joi.string().max(10).allow('', null),
  timestamp: Joi.string().isoDate().allow('', null).messages({
    'string.isoDate': 'timestamp must be a valid ISO date string',
  }),
});

/**
 * Memvalidasi data terhadap schema
 * @param {Joi.Schema} schema - Schema Joi
 * @param {Object} data - Data yang akan divalidasi
 * @returns {{ error: Joi.ValidationError|null, value: Object }}
 */
function validate(schema, data) {
  return schema.validate(data, { 
    abortEarly: false,
    stripUnknown: true,
  });
}

/**
 * Validasi password secara langsung
 * @param {string} password - Password yang akan divalidasi
 * @returns {{ valid: boolean, message: string|null }}
 */
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password minimal 8 karakter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 huruf kecil' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 huruf besar' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 angka' };
  }
  if (!/[@$!%*?&]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 karakter spesial (@$!%*?&)' };
  }
  return { valid: true, message: null };
}

/**
 * Membuat middleware validasi
 * @param {Joi.Schema} schema - Schema Joi
 * @returns {Function} Middleware Express
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = validate(schema, req.body);
    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details,
        },
      });
    }
    req.body = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  createKeySchema,
  createBlacklistSchema,
  updateBlacklistSchema,
  scoreRequestSchema,
  validate,
  validateBody,
  validatePassword,
};
