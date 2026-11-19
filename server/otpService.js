// server/otpService.js
// Production-grade Email OTP dispatch & verification service
// Security suite: 6-digit cryptographic OTP, HMAC-SHA256 hashed storage,
// 5-minute validity, 60s cooldown, max 5 verification attempts, single-use,
// cryptographically signed verification tokens, and backend validation.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Constants
export const OTP_TTL_MS = 5 * 60 * 1000;         // Strictly 5 minutes
export const SEND_COOLDOWN_MS = 60 * 1000;       // 60-second cooldown between requests
export const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; // 4 Hours lockout window
export const MAX_ATTEMPTS_PER_WINDOW = 5;       // Maximum 5 OTP requests per 4 hours
export const MAX_VERIFY_ATTEMPTS = 5;           // Maximum 5 incorrect verify attempts per code

// Secrets (from environment or secure fallback)
const OTP_PEPPER = process.env.OTP_SALT || 'concave_realty_otp_pepper_2026';
const VERIFICATION_SECRET = process.env.VERIFICATION_SECRET || 'concave_career_verified_token_sec_2026';

// Load RESEND_API_KEY from process.env or .env file
let resendApiKey = process.env.RESEND_API_KEY || '';
if (!resendApiKey) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/RESEND_API_KEY=(.+)/);
      if (match) resendApiKey = match[1].trim();
    }
  } catch (e) {
    console.error('[OTP Service] Failed to read .env:', e.message);
  }
}

// In-memory Secure OTP storage
// Key: normalized email -> Value: { hashedOtp, salt, expiresAt, attempts, lastSentAt, digits }
const otpStore = new Map();

// Rate limit history: identifier -> array of timestamps
const rateLimitHistory = new Map();

// In-memory Verified Sessions store (tied to applicant email)
// Key: normalized email -> Value: { token, verifiedAt, expiresAt }
const verifiedSessionStore = new Map();

/**
 * Generate cryptographically secure random OTP
 */
function generateSecureOtp(digits = 6) {
  if (digits === 4) {
    return crypto.randomInt(1000, 10000).toString();
  }
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hash OTP using HMAC-SHA256 with per-record random salt + pepper
 */
function hashOtp(otp, salt) {
  return crypto.createHmac('sha256', `${salt}:${OTP_PEPPER}`).update(otp.trim()).digest('hex');
}

/**
 * Server-side Rate Limiter
 * Enforces:
 * 1. 60-second cooldown between consecutive sends
 * 2. Maximum 5 sends per 4-hour window
 */
function checkServerRateLimit(identifier) {
  const cleanId = (identifier || '').toLowerCase().trim();
  if (!cleanId) return { allowed: true };

  const now = Date.now();
  const attempts = rateLimitHistory.get(cleanId) || [];

  // Filter attempts strictly within the 4-hour window
  const recentAttempts = attempts.filter(ts => (now - ts) < FOUR_HOURS_MS);
  rateLimitHistory.set(cleanId, recentAttempts);

  // Check 5-attempt limit per 4 hours
  if (recentAttempts.length >= MAX_ATTEMPTS_PER_WINDOW) {
    const oldest = Math.min(...recentAttempts);
    const resetAt = oldest + FOUR_HOURS_MS;
    const remainingMs = Math.max(0, resetAt - now);
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.ceil((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;

    return {
      allowed: false,
      code: 'MAX_ATTEMPTS_EXCEEDED',
      message: `Security limit reached: Maximum 5 OTP attempts allowed per 4 hours. Cooldown active for another ${timeStr}.`
    };
  }

  // Check 60-second interval between consecutive requests
  if (recentAttempts.length > 0) {
    const lastAttempt = recentAttempts[recentAttempts.length - 1];
    const diff = now - lastAttempt;
    if (diff < SEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((SEND_COOLDOWN_MS - diff) / 1000);
      return {
        allowed: false,
        code: 'COOLDOWN_ACTIVE',
        remainingSeconds,
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`
      };
    }
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS_PER_WINDOW - recentAttempts.length };
}

function recordServerRateLimit(identifier) {
  const cleanId = (identifier || '').toLowerCase().trim();
  if (!cleanId) return;
  const now = Date.now();
  const attempts = rateLimitHistory.get(cleanId) || [];
  attempts.push(now);
  rateLimitHistory.set(cleanId, attempts.filter(ts => (now - ts) < FOUR_HOURS_MS));
}

/**
 * Generate cryptographically signed verification token linked to applicant email
 */
export function generateVerificationToken(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const timestamp = Date.now();
  const data = `${cleanEmail}:${timestamp}`;
  const signature = crypto.createHmac('sha256', VERIFICATION_SECRET).update(data).digest('hex');
  return `${data}:${signature}`;
}

/**
 * Validate that a submitted email has a genuine, unexpired server verification token
 */
export function validateVerifiedEmail(email, token) {
  if (!email || !token) {
    return { valid: false, message: 'Please verify your email address before submitting your application.' };
  }

  const cleanEmail = email.toLowerCase().trim();
  const parts = token.split(':');
  if (parts.length !== 3) {
    return { valid: false, message: 'Invalid verification token format. Please re-verify your email.' };
  }

  const [tokenEmail, timestampStr, signature] = parts;
  if (tokenEmail !== cleanEmail) {
    return { valid: false, message: 'Verification token does not match the submitted email address.' };
  }

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp) || Date.now() - timestamp > 30 * 60 * 1000) {
    return { valid: false, message: 'Verification session expired (30-minute validity). Please verify again.' };
  }

  const data = `${tokenEmail}:${timestampStr}`;
  const expectedSignature = crypto.createHmac('sha256', VERIFICATION_SECRET).update(data).digest('hex');

  try {
    const isSigMatch = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
    if (!isSigMatch) {
      return { valid: false, message: 'Invalid verification token signature.' };
    }
  } catch {
    return { valid: false, message: 'Cryptographic validation failed.' };
  }

  // Check server-side verified session
  const session = verifiedSessionStore.get(cleanEmail);
  if (!session || session.token !== token) {
    return { valid: false, message: 'Email has not been verified on this server session. Please verify your email.' };
  }

  if (Date.now() > session.expiresAt) {
    verifiedSessionStore.delete(cleanEmail);
    return { valid: false, message: 'Email verification has expired. Please verify your email again.' };
  }

  return { valid: true };
}

/**
 * Luxury Concave Realty Branded Email Template Generator
 */
function buildLuxuryEmailHtml({ name, otp, purpose }) {
  const clientName = name && name.trim() ? name.trim() : 'Candidate';
  const isCareer = purpose === 'career' || !purpose;
  const leadText = isCareer
    ? 'Thank you for your interest in joining Concave Realty. To safeguard your career application and verify your official email address, please use the 6-digit verification code below:'
    : 'Thank you for your interest in an exclusive property consultation with Concave Realty. To safeguard your advisory inquiry and verify your contact identity, please use the verification code below:';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concave Realty - Email Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #14221F;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(29, 53, 48, 0.08); border: 1px solid #EAE6DF;">
          
          <!-- Top Header Banner (Forest Green & Champagne Gold) -->
          <tr>
            <td style="background-color: #1D3530; padding: 36px 30px; text-align: center; border-bottom: 3px solid #C59B4E;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 48px; height: 48px; border-radius: 50%; background-color: #284F45; border: 1.5px solid #C59B4E; line-height: 48px; text-align: center; margin-bottom: 12px;">
                      <span style="color: #DFBE79; font-size: 22px;">🏛️</span>
                    </div>
                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: 700; color: #FAF9F6; letter-spacing: 1.5px;">CONCAVE REALTY</h1>
                    <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #DFBE79; font-weight: 500;">Where Legacy Meets Luxury</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #1D3530; font-weight: 600;">Dear ${clientName},</p>
              
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.65; color: #4A463F;">
                ${leadText}
              </p>

              <!-- Luxury OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 26px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #FAF9F6; border: 2px dashed #C59B4E; border-radius: 12px; padding: 18px 36px; text-align: center;">
                      <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; color: #C59B4E; margin-bottom: 6px; font-weight: bold;">
                        Verification Code (Valid 5 Minutes)
                      </div>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #1D3530; text-indent: 12px;">
                        ${otp}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Security Badge -->
              <div style="background-color: #F8F7F3; border: 1px solid #EAE6DF; border-radius: 8px; padding: 12px 16px; margin: 20px 0 24px; text-align: center;">
                <p style="margin: 0; font-size: 11.5px; color: #736B5E; line-height: 1.5;">
                  ⏱️ <strong>Strictly valid for 5 minutes</strong> • Never share this verification code with anyone. Concave Realty will never ask for your code.
                </p>
              </div>

              <p style="margin: 0; font-size: 12.5px; line-height: 1.6; color: #4A463F;">
                Once verified, you may submit your application with complete institutional security.
              </p>
            </td>
          </tr>

          <!-- Statutory Corporate Footer -->
          <tr>
            <td style="background-color: #FAF9F6; border-top: 1px solid #EAE6DF; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px; font-family: monospace; font-size: 11px; font-weight: 700; color: #1D3530;">
                MahaRERA Registered Real Estate Agent: A51900045781
              </p>
              <p style="margin: 0 0 10px; font-size: 11px; color: #736B5E; line-height: 1.5;">
                Western Suburbs & South Mumbai Luxury Advisory • Mumbai, Maharashtra
              </p>
              <div style="font-size: 10.5px; color: #9E9689; border-top: 1px solid #EDE9E1; padding-top: 10px;">
                Concave Realty Talent Acquisition Desk • concaverealtyindia@gmail.com • +91 8291090155
              </div>
            </td>
          </tr>

        </table>

        <!-- Anti-Spam Notice -->
        <table role="presentation" width="100%" style="max-width: 560px; margin-top: 16px;">
          <tr>
            <td style="text-align: center; font-size: 10.5px; color: #8F887C; line-height: 1.4;">
              This is an automated security verification email for Concave Realty. If you did not initiate this request, you can safely disregard this message.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send OTP via Email (Priority #1)
 * Generates secure 6-digit OTP (or 4-digit for legacy caller if requested),
 * stores hashed OTP with salt, and dispatches via Resend API.
 */
export async function sendOtpEmail({ email, name, digits = 6, purpose = 'career' }) {
  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const rateLimitId = normalizedEmail;

  // Rate Limiting Check (5 per 4-hour window per email)
  const rateCheck = checkServerRateLimit(rateLimitId);
  if (!rateCheck.allowed) {
    const err = new Error(rateCheck.message);
    err.code = rateCheck.code;
    err.remainingSeconds = rateCheck.remainingSeconds;
    throw err;
  }

  // Generate secure random OTP (6 digits for career, or specified digits)
  const otpLength = Number(digits) === 4 ? 4 : 6;
  const otp = generateSecureOtp(otpLength);
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedOtp = hashOtp(otp, salt);

  const htmlContent = buildLuxuryEmailHtml({ name, otp, purpose });

  // If Resend API key is available, dispatch live email via Resend
  let emailDispatched = false;
  let messageId = null;

  if (resendApiKey && !resendApiKey.includes('your_api_key')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Concave Realty <onboarding@resend.dev>',
          to: [normalizedEmail],
          subject: `Your Concave Realty Verification Code: [ ${otp} ]`,
          html: htmlContent
        })
      });

      const resData = await response.json();

      if (response.ok) {
        emailDispatched = true;
        messageId = resData.id;
      } else {
        console.warn('[OTP Service] Resend API notice:', resData.message || resData);
      }
    } catch (dispatchErr) {
      console.error('[OTP Service] Resend dispatch error:', dispatchErr.message);
    }
  } else {
    console.info(`[OTP Service] RESEND_API_KEY not configured. Generated 6-digit OTP for ${normalizedEmail}: ${otp}`);
  }

  // Record rate limit attempt
  recordServerRateLimit(rateLimitId);

  // Store hashed OTP with salt (plain text is NEVER stored)
  otpStore.set(normalizedEmail, {
    hashedOtp,
    salt,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: Date.now(),
    digits: otpLength
  });

  return {
    success: true,
    messageId,
    emailDispatched,
    cooldownSeconds: 60,
    expiresInSeconds: 300,
    message: 'OTP sent successfully. Please check your email.'
  };
}

/**
 * Verify OTP entered by candidate
 * Validates 6-digit code against HMAC-SHA256 hash using timing-safe comparison.
 * Max 5 attempts. Invalidates on success to prevent reuse.
 * Issues cryptographically signed verification token.
 */
export function verifyOtpCode({ email, otp }) {
  if (!otp || !otp.trim()) {
    return { success: false, message: 'OTP verification code is required.' };
  }

  const cleanOtp = otp.trim();
  const normalizedEmail = (email || '').trim().toLowerCase();

  const record = normalizedEmail ? otpStore.get(normalizedEmail) : null;

  if (!record) {
    return { success: false, message: 'No OTP requested for this email address. Please click Send OTP first.' };
  }

  // Check 5-minute expiry
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { success: false, code: 'OTP_EXPIRED', message: 'OTP has expired (5-minute limit). Please request a new code.' };
  }

  // Brute-force protection: max 5 attempts on the same code
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return { success: false, code: 'MAX_ATTEMPTS_EXCEEDED', message: 'Maximum verification attempts exceeded (5/5). Please request a new OTP.' };
  }

  // Timing-safe HMAC hash check
  const computedHash = hashOtp(cleanOtp, record.salt);
  let isMatch = false;

  try {
    isMatch = crypto.timingSafeEqual(
      Buffer.from(record.hashedOtp, 'hex'),
      Buffer.from(computedHash, 'hex')
    );
  } catch {
    isMatch = false;
  }

  if (!isMatch) {
    record.attempts += 1;
    const remaining = MAX_VERIFY_ATTEMPTS - record.attempts;
    if (remaining <= 0) {
      otpStore.delete(normalizedEmail);
      return {
        success: false,
        code: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum verification attempts exceeded (5/5). Please request a new OTP.'
      };
    }
    return {
      success: false,
      remainingAttempts: remaining,
      message: `Invalid OTP. Please check your email. (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)`
    };
  }

  // Verified successfully!
  // Delete OTP record immediately to prevent reuse
  otpStore.delete(normalizedEmail);

  // Generate signed verification token and record session (valid for 30 min)
  const token = generateVerificationToken(normalizedEmail);
  verifiedSessionStore.set(normalizedEmail, {
    token,
    verifiedAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000)
  });

  return {
    success: true,
    verified: true,
    token,
    message: 'Email Verified Successfully.'
  };
}
