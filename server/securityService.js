import crypto from 'crypto';

// ============================================================================
// CONCAVE REALTY ZERO-TRUST SECURITY ENGINE
// Defense-in-Depth Implementation: RLS, IDOR, Rate-Limiting, CSP, Sanitization
// ============================================================================

// ----------------------------------------------------------------------------
// 1. RATE LIMITING & SLIDING WINDOW CONTROLLER
// ----------------------------------------------------------------------------
const rateLimitStore = new Map();
const BLACKLIST_THRESHOLD = 20; // 20 failed hits -> temporary block
const blacklistedIps = new Map();

/**
 * Check and record IP rate limit against a sliding window
 * @param {string} ip - Client IP
 * @param {string} route - API Route identifier
 * @param {number} maxRequests - Max allowed in window
 * @param {number} windowMs - Window duration in ms
 */
export function checkRateLimit(ip, route = 'global', maxRequests = 60, windowMs = 60000) {
  const now = Date.now();
  const cleanIp = (ip || '127.0.0.1').replace(/^.*:/, '');

  // Check temporary blacklist
  if (blacklistedIps.has(cleanIp)) {
    const unbanAt = blacklistedIps.get(cleanIp);
    if (now < unbanAt) {
      const waitSec = Math.ceil((unbanAt - now) / 1000);
      return {
        allowed: false,
        status: 429,
        reason: 'IP_TEMPORARILY_BLOCKED',
        message: `Your IP has been flagged for abnormal traffic. Please retry in ${waitSec}s.`,
        retryAfter: waitSec
      };
    } else {
      blacklistedIps.delete(cleanIp);
    }
  }

  const key = `${cleanIp}:${route}`;
  const record = rateLimitStore.get(key) || { requests: [] };

  // Filter out timestamps outside sliding window
  record.requests = record.requests.filter(t => now - t < windowMs);

  if (record.requests.length >= maxRequests) {
    record.violations = (record.violations || 0) + 1;
    if (record.violations >= BLACKLIST_THRESHOLD) {
      blacklistedIps.set(cleanIp, now + 15 * 60 * 1000); // 15 min ban
    }
    rateLimitStore.set(key, record);
    const oldest = record.requests[0];
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      status: 429,
      reason: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000}s.`,
      retryAfter
    };
  }

  record.requests.push(now);
  rateLimitStore.set(key, record);
  return { allowed: true, remaining: maxRequests - record.requests.length };
}

// ----------------------------------------------------------------------------
// 2. INPUT SANITIZATION & ANTI-INJECTION SHIELD
// ----------------------------------------------------------------------------
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on\w+\s*=/gi, // onerror, onload, onclick, etc.
  /\b(exec|union|select|insert|update|delete|drop|alter|truncate)\b\s+.*--/gi,
  /[\u0000-\u001F\u007F-\u009F]/g // control characters
];

/**
 * Strip harmful HTML, JavaScript pseudoprotocols, and control characters
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  let cleaned = input.trim().slice(0, maxLength);

  // Strip dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // HTML entity encode remaining sensitive characters
  return cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Deep recursive object sanitizer (prevents prototype pollution)
 */
export function sanitizePayload(data, depth = 0) {
  if (depth > 6) return null; // recursion limit
  if (data === null || typeof data !== 'object') {
    return typeof data === 'string' ? sanitizeString(data) : data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizePayload(item, depth + 1));
  }

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    // Prevent prototype pollution attacks
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    const safeKey = sanitizeString(key, 100);
    clean[safeKey] = sanitizePayload(value, depth + 1);
  }
  return clean;
}

// ----------------------------------------------------------------------------
// 3. PARAMETERIZED QUERY ABSTRACTION (SQL / NoSQL Injection Prevention)
// ----------------------------------------------------------------------------
export class ParameterizedQuery {
  /**
   * Safe parameterized query executor
   * @param {string} queryTemplate - e.g. "SELECT * FROM leads WHERE location_id = ? AND status = ?"
   * @param {Array} params - array of typed parameters [locId, status]
   */
  static prepare(queryTemplate, params = []) {
    // Verify param count matches placeholder count
    const matches = queryTemplate.match(/\?/g) || [];
    if (matches.length !== params.length) {
      throw new Error(`ParameterizedQuery mismatch: Expected ${matches.length} parameters, got ${params.length}`);
    }

    // Strictly validate and type-escape each parameter
    const sanitizedParams = params.map(param => {
      if (param === null || param === undefined) return null;
      if (typeof param === 'number') {
        if (!Number.isFinite(param)) throw new Error('Invalid numeric parameter: NaN or Infinity');
        return param;
      }
      if (typeof param === 'boolean') return param ? 1 : 0;
      if (typeof param === 'string') {
        // Enforce safe string representation
        return param.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
          switch (char) {
            case "\0": return "\\0";
            case "\x08": return "\\b";
            case "\x09": return "\\t";
            case "\x1a": return "\\z";
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
              return "\\" + char;
            default:
              return char;
          }
        });
      }
      throw new Error(`Unsupported parameter type: ${typeof param}`);
    });

    return {
      template: queryTemplate,
      parameters: sanitizedParams,
      execute: (executorFn) => executorFn(queryTemplate, sanitizedParams)
    };
  }
}

// ----------------------------------------------------------------------------
// 4. ROW LEVEL SECURITY (RLS) & IDOR PREVENTION
// ----------------------------------------------------------------------------
/**
 * Enforce strict Row Level Security & prevent Insecure Direct Object References (IDOR)
 * @param {Object} actor - The user performing the action { id, role: 'admin'|'caller', territoryIds: [] }
 * @param {Object} record - The target record { id, callerId, locationId, ... }
 * @param {string} action - 'READ' | 'WRITE' | 'DELETE' | 'EXPORT'
 */
export function enforceRowLevelSecurity(actor, record, action = 'READ') {
  if (!actor || !actor.role) {
    return {
      authorized: false,
      status: 401,
      reason: 'UNAUTHENTICATED',
      message: 'Authentication is required to access this resource.'
    };
  }

  // Super Admin has full clearance
  if (actor.role === 'admin' || actor.role === 'superadmin') {
    return { authorized: true, role: 'admin' };
  }

  // Caller role: Strictly scoped to their own leads
  if (actor.role === 'caller') {
    // Callers can NEVER delete records or export master database
    if (action === 'DELETE' || action === 'EXPORT') {
      return {
        authorized: false,
        status: 403,
        reason: 'RLS_PRIVILEGE_VIOLATION',
        message: 'Forbidden: Callers lack permission to perform this administrative operation.'
      };
    }

    // Check if the record is assigned directly to this caller
    const isAssigned = (record.c === actor.id) || (record.callerId === actor.id);
    const inTerritory = actor.territoryIds && actor.territoryIds.includes(record.l || record.locationId);

    if (isAssigned || inTerritory) {
      return { authorized: true, role: 'caller' };
    }

    // IDOR Prevented: Caller tried to access an unassigned lead or another caller's lead
    return {
      authorized: false,
      status: 403,
      reason: 'IDOR_PREVENTED',
      message: 'Access Denied: You do not have permission to view or modify this record.'
    };
  }

  return {
    authorized: false,
    status: 403,
    reason: 'UNKNOWN_ROLE',
    message: 'Access Denied: Unrecognized actor role.'
  };
}

// ----------------------------------------------------------------------------
// 5. IMMUTABLE ADMIN AUDIT LOGGER
// ----------------------------------------------------------------------------
const auditLogs = [];
const AUDIT_SECRET = process.env.AUDIT_HMAC_SECRET || 'concave_audit_secret_2026';

/**
 * Log an administrative action with tamper-evident HMAC signature
 */
export function logAdminAction(actor, actionType, targetResource, details = {}, ip = '127.0.0.1') {
  const timestamp = new Date().toISOString();
  const entry = {
    id: crypto.randomUUID(),
    timestamp,
    actorId: actor?.id || 'ANONYMOUS',
    actorName: actor?.name || actor?.username || 'Unknown',
    actorRole: actor?.role || 'none',
    actionType, // 'LOGIN', 'LOGOUT', 'UPDATE_STATUS', 'DELETE_LEAD', 'EXPORT_EXCEL', 'VIEW_DOSSIER'
    targetResource,
    ip: (ip || '127.0.0.1').replace(/^.*:/, ''),
    details: sanitizePayload(details)
  };

  // Generate cryptographic integrity hash
  const payloadString = JSON.stringify(entry);
  entry.signature = crypto
    .createHmac('sha256', AUDIT_SECRET)
    .update(payloadString)
    .digest('hex');

  auditLogs.push(entry);

  // Keep memory capped at 5000 entries
  if (auditLogs.length > 5000) {
    auditLogs.shift();
  }

  return entry;
}

export function getAuditLogs(actor, limit = 100) {
  if (!actor || (actor.role !== 'admin' && actor.role !== 'superadmin')) {
    throw new Error('Unauthorized: Only administrators can inspect audit logs.');
  }
  return auditLogs.slice(-limit).reverse();
}

// ----------------------------------------------------------------------------
// 6. FILE UPLOAD SECURITY (MIME, Magic Bytes, Size & Path Traversal)
// ----------------------------------------------------------------------------
const ALLOWED_MIME_TYPES = new Map([
  ['application/pdf', { ext: '.pdf', magic: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  ['image/jpeg', { ext: '.jpg', magic: [0xFF, 0xD8, 0xFF] }],
  ['image/png', { ext: '.png', magic: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
  ['image/webp', { ext: '.webp', magic: [0x52, 0x49, 0x46, 0x46] }] // RIFF
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateFileUpload(buffer, declaredMime, originalFilename) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file buffer' };
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    return { valid: false, error: 'File size exceeds maximum allowed limit of 5MB' };
  }

  // Sanitize original filename (remove path traversal attempts)
  const safeBaseName = originalFilename
    .replace(/^.*[\\\/]/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  const mimeConfig = ALLOWED_MIME_TYPES.get(declaredMime);
  if (!mimeConfig) {
    return { valid: false, error: `Disallowed MIME type: ${declaredMime}. Allowed: PDF, JPG, PNG, WEBP.` };
  }

  // Validate Magic Bytes (File Header Signature)
  const magic = mimeConfig.magic;
  const header = buffer.slice(0, magic.length);
  for (let i = 0; i < magic.length; i++) {
    if (header[i] !== magic[i]) {
      return {
        valid: false,
        error: `Spoofed file detected: Header does not match declared format ${declaredMime}`
      };
    }
  }

  // Generate safe storage key using cryptographically secure UUID
  const safeStorageKey = `vault/${crypto.randomUUID()}${mimeConfig.ext}`;

  return {
    valid: true,
    safeStorageKey,
    sanitizedFilename: safeBaseName,
    sizeBytes: buffer.length
  };
}

// ----------------------------------------------------------------------------
// 7. PRIVATE STORAGE & PRESIGNED URLS
// ----------------------------------------------------------------------------
const STORAGE_SIGNING_SECRET = process.env.STORAGE_SIGNING_SECRET || 'concave_storage_vault_key_2026';

/**
 * Generate a time-limited presigned URL for private storage
 */
export function generatePresignedUrl(objectKey, ttlSeconds = 300) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${objectKey}:${expiresAt}`;
  const token = crypto
    .createHmac('sha256', STORAGE_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  return {
    url: `/api/vault/document?key=${encodeURIComponent(objectKey)}&expires=${expiresAt}&token=${token}`,
    expiresAt
  };
}

/**
 * Validate a presigned URL token
 */
export function verifyPresignedToken(objectKey, expiresAt, token) {
  const now = Math.floor(Date.now() / 1000);
  if (now > parseInt(expiresAt, 10)) {
    return { valid: false, error: 'Presigned URL has expired' };
  }

  const payload = `${objectKey}:${expiresAt}`;
  const expected = crypto
    .createHmac('sha256', STORAGE_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  const valid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  return valid ? { valid: true } : { valid: false, error: 'Invalid storage token signature' };
}

// ----------------------------------------------------------------------------
// 8. WEBHOOK SIGNATURE VERIFIER (Timing-Safe HMAC)
// ----------------------------------------------------------------------------
export function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  try {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const cleanHeader = signatureHeader.replace(/^sha256=/, '');
    const sigBuffer = Buffer.from(cleanHeader, 'hex');
    const computedBuffer = Buffer.from(computedSignature, 'hex');

    if (sigBuffer.length !== computedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, computedBuffer);
  } catch (err) {
    return false;
  }
}

// ----------------------------------------------------------------------------
// 9. HTTP SECURITY HEADERS CONFIGURATION
// ----------------------------------------------------------------------------
export const ENTERPRISE_SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self' https://api.resend.com https://graph.facebook.com",
    "frame-src 'self' https://maps.google.com https://www.google.com https://view.pixeldo.com https://*.pixeldo.com https://*.google.com https://*.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

