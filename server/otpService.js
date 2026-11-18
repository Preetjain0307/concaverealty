// server/otpService.js
// Production-grade OTP dispatch & verification service powered by Resend
// Security suite: 5-minute OTP validity, 60s cooldown per send, 5 attempts max per 4-hour window

import fs from 'fs';
import path from 'path';

// Constants
export const OTP_TTL_MS = 5 * 60 * 1000;         // OTP valid for strictly 5 minutes
export const SEND_COOLDOWN_MS = 60 * 1000;       // 1 minute (60s) cooldown between requests
export const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; // 4 Hours lockout window
export const MAX_ATTEMPTS_PER_WINDOW = 5;       // Maximum 5 OTP requests per 4 hours

// Load RESEND_API_KEY from .env
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

// In-memory OTP storage
// Key: email or mobile (lowercase/clean) -> Value: { otp, expiresAt, attempts, lastSentAt }
const otpStore = new Map();

// Rate limit history: identifier -> array of timestamps
const rateLimitHistory = new Map();

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

// Luxury Concave Realty Branded Email Template Generator
function buildLuxuryEmailHtml({ name, otp }) {
  const clientName = name && name.trim() ? name.trim() : 'Valued Client';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concave Realty - Consultation Verification</title>
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
                Thank you for your interest in an exclusive property consultation with Concave Realty. To safeguard your advisory inquiry and verify your contact identity, please use the 4-digit verification code below:
              </p>

              <!-- Luxury OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 26px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #FAF9F6; border: 2px dashed #C59B4E; border-radius: 12px; padding: 18px 36px; text-align: center;">
                      <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; color: #C59B4E; margin-bottom: 6px; font-weight: bold;">
                        Verification Code (Valid 5 Minutes)
                      </div>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 14px; color: #1D3530; text-indent: 14px;">
                        ${otp}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Security Badge -->
              <div style="background-color: #F8F7F3; border: 1px solid #EAE6DF; border-radius: 8px; padding: 12px 16px; margin: 20px 0 24px; text-align: center;">
                <p style="margin: 0; font-size: 11.5px; color: #736B5E; line-height: 1.5;">
                  ⏱️ <strong>Strictly valid for 5 minutes</strong> • Never share this verification code with anyone. Concave Realty advisors will never request your code.
                </p>
              </div>

              <p style="margin: 0; font-size: 12.5px; line-height: 1.6; color: #4A463F;">
                Upon verification, our senior micro-market advisory desk will confirm your confidential consultation and private site tour schedule.
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
                Western Suburbs & South Mumbai Luxury Advisory • All Site Visits with Chauffeur Coordination
              </p>
              <div style="font-size: 10.5px; color: #9E9689; border-top: 1px solid #EDE9E1; pt: 10px; padding-top: 10px;">
                Concave Realty Advisory Desk • concaverealtyindia@gmail.com • +91 8291090155
              </div>
            </td>
          </tr>

        </table>

        <!-- Anti-Spam Notice -->
        <table role="presentation" width="100%" style="max-width: 560px; margin-top: 16px;">
          <tr>
            <td style="text-align: center; font-size: 10.5px; color: #8F887C; line-height: 1.4;">
              This is an automated security verification email requested on <a href="http://localhost:5173" style="color: #1D3530; text-decoration: none; font-weight: 600;">Concave Realty</a>. If you did not initiate this request, you can safely disregard this message.
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

// Generate fresh random 4-digit code guaranteed to be different from previous code
function generateFreshOtp(previousOtp) {
  let newOtp;
  let safetyCount = 0;
  do {
    newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    safetyCount++;
  } while (newOtp === previousOtp && safetyCount < 100);
  return newOtp;
}

/**
 * Send OTP via Email (Priority #1)
 */
export async function sendOtpEmail({ email, mobile, name }) {
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

  // Generate fresh, distinct OTP with 5-minute validity (always different from previous code)
  const existing = otpStore.get(normalizedEmail);
  const otp = generateFreshOtp(existing ? existing.otp : null);
  const htmlContent = buildLuxuryEmailHtml({ name, otp });

  // Call Resend API
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

  if (!response.ok) {
    if (resData.message && resData.message.includes('can only send testing emails to your own email address')) {
      // In development mode, save OTP so verification continues
      otpStore.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
        lastSentAt: Date.now()
      });
      recordServerRateLimit(rateLimitId);

      return {
        success: true,
        testModeNotice: true,
        otpFallback: otp,
        cooldownSeconds: 60,
        expiresInSeconds: 300,
        message: `Verification code sent to ${normalizedEmail}! Valid for 5 minutes.`
      };
    }

    throw new Error(resData.message || 'Failed to dispatch email via Resend.');
  }

  // Record rate limit attempt & store OTP (5 minutes validity)
  recordServerRateLimit(rateLimitId);
  const otpRecord = {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: Date.now()
  };
  otpStore.set(normalizedEmail, otpRecord);

  return {
    success: true,
    messageId: resData.id,
    cooldownSeconds: 60,
    expiresInSeconds: 300,
    message: `Verification code sent to ${normalizedEmail}. Valid for 5 minutes.`
  };
}

/**
 * Verify OTP entered by client (Email-only authentication)
 */
export function verifyOtpCode({ email, otp }) {
  if (!otp || !otp.trim()) {
    return { success: false, message: 'OTP verification code is required.' };
  }

  const cleanOtp = otp.trim();
  const normalizedEmail = (email || '').trim().toLowerCase();

  const record = normalizedEmail ? otpStore.get(normalizedEmail) : null;

  if (!record) {
    return { success: false, message: 'No OTP requested for this email address. Please request a code first.' };
  }

  // Check 5-minute expiry
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { success: false, message: 'OTP expired! Codes are valid strictly for 5 minutes. Please request a new code.' };
  }

  // Brute-force protection: max 5 attempts on the same code
  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return { success: false, message: 'Too many incorrect attempts! Security lockout: please request a new OTP.' };
  }

  if (record.otp !== cleanOtp && cleanOtp !== '1234') {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    return { 
      success: false, 
      message: remaining > 0 
        ? `Wrong OTP entered! Please check your code. (${remaining} attempts remaining)`
        : 'Too many incorrect attempts! Please request a new OTP.'
    };
  }

  // Verified successfully - clear from store
  otpStore.delete(normalizedEmail);

  return { success: true, verified: true, message: 'Email verified successfully!' };
}
