/**
 * Middleware untuk sanitasi input dan perlindungan XSS.
 * Membersihkan karakter berbahaya dari input user.
 */

/**
 * Membersihkan string dari karakter HTML berbahaya
 * @param {string} str - String yang akan di-sanitize
 * @returns {string} String yang sudah bersih
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Membersihkan objek secara rekursif
 * @param {object} obj - Objek yang akan di-sanitize
 * @returns {object} Objek yang sudah bersih
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip sanitasi untuk field password (tidak perlu di-escape)
      if (key.toLowerCase().includes('password')) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Middleware Express untuk sanitasi request body, query, dan params
 */
function sanitizeInput(req, res, next) {
  // Sanitasi body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitasi query params
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitasi URL params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
}

/**
 * Daftar pola berbahaya yang sering digunakan dalam serangan
 */
const dangerousPatterns = [
  /<\s*script\b/i,
  /javascript\s*:/i,
  /\bon\w+\s*=/i, // onclick, onerror, etc.
  /\beval\s*\(/i,
  /\bdocument\.(cookie|write|location)\b/i,
  /\bwindow\.(location|open)\b/i,
];

/**
 * Mengecek apakah string mengandung pola berbahaya
 * @param {string} str - String yang akan dicek
 * @returns {boolean} True jika mengandung pola berbahaya
 */
function containsDangerousPattern(str) {
  if (typeof str !== 'string') return false;

  // Guard: avoid expensive scanning on very large strings
  if (str.length > 20000) return true;

  return dangerousPatterns.some(pattern => pattern.test(str));
}

/**
 * Middleware untuk mendeteksi dan memblokir request yang mengandung pola berbahaya
 */
function detectXSSAttack(req, res, next) {
  const checkObject = (obj, path = '') => {
    if (typeof obj === 'string' && containsDangerousPattern(obj)) {
      return `${path}`;
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        // Skip scanning password fields (avoid leaking rules / false positives)
        if (typeof key === 'string' && key.toLowerCase().includes('password')) {
          continue;
        }
        const result = checkObject(value, path ? `${path}.${key}` : key);
        if (result) return result;
      }
    }
    return null;
  };

  // Cek body, query, dan params
  const dangerousInBody = checkObject(req.body, 'body');
  const dangerousInQuery = checkObject(req.query, 'query');
  const dangerousInParams = checkObject(req.params, 'params');

  if (dangerousInBody || dangerousInQuery || dangerousInParams) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'POTENTIAL_XSS_ATTACK',
        message: 'Request mengandung pola yang tidak diizinkan dan telah diblokir untuk keamanan.',
      },
    });
  }

  next();
}

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeObject,
  detectXSSAttack,
  containsDangerousPattern,
};
