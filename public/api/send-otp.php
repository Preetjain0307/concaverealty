<?php
/**
 * Concave Realty - POST /api/send-otp
 * Shared Hosting PHP Endpoint for Email OTP Dispatch via Resend API
 */

require_once __DIR__ . '/config.php';
send_json_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// 1. Read & Sanitize JSON Input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$name = isset($data['name']) ? strip_tags(trim($data['name'])) : 'Client';
$purpose = isset($data['purpose']) ? strip_tags(trim($data['purpose'])) : 'enquiry';
$isEnquiry = ($purpose === 'enquiry' || (isset($data['digits']) && intval($data['digits']) === 4));
$digits = $isEnquiry ? 4 : 6;

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

$normalizedEmail = strtolower($email);
$clientIp = get_client_ip();
$ipRateKey = 'ip_' . md5($clientIp);

// 2. Dual-Layer Rate Limiting (Check IP first, then Email)
$ipRateCheck = check_rate_limit($ipRateKey, 15, 0); // Max 15 per IP per 4 hours
if (!$ipRateCheck['allowed']) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'code' => 'IP_RATE_LIMITED',
        'message' => 'Too many requests from your network. Please wait before requesting another OTP.'
    ]);
    exit;
}

$rateCheck = check_rate_limit($normalizedEmail);
if (!$rateCheck['allowed']) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'code' => $rateCheck['code'],
        'remainingSeconds' => isset($rateCheck['remainingSeconds']) ? $rateCheck['remainingSeconds'] : null,
        'message' => $rateCheck['message']
    ]);
    exit;
}

// 3. Generate Cryptographic Random OTP
$otp = ($digits === 4) ? strval(random_int(1000, 9999)) : strval(random_int(100000, 999999));
$salt = bin2hex(random_bytes(16));
$hashedOtp = hash_otp_code($otp, $salt);

// 4. Build Luxury HTML Email Template
$clientName = !empty($name) ? htmlspecialchars($name, ENT_QUOTES, 'UTF-8') : 'Client';
$isCareer = ($purpose === 'career');
$leadText = $isCareer
    ? 'Thank you for your interest in joining Concave Realty. To safeguard your career application and verify your official email address, please use the 6-digit verification code below:'
    : 'Thank you for your interest in an exclusive property consultation with Concave Realty. To safeguard your advisory inquiry and verify your contact identity, please use the verification code below:';

$subject = "Your Concave Realty Verification Code: [ {$otp} ]";

$htmlContent = <<<HTML
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
              <p style="margin: 0 0 16px; font-size: 15px; color: #1D3530; font-weight: 600;">Dear {$clientName},</p>
              
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.65; color: #4A463F;">
                {$leadText}
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
                        {$otp}
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

              <!-- Assistance Note -->
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #736B5E;">
                If you have questions regarding this advisory inquiry, please reach out to our dedicated advisory desk at 
                <a href="mailto:concaverealtyindia@gmail.com" style="color: #1D3530; text-decoration: underline; font-weight: 600;">concaverealtyindia@gmail.com</a> 
                or via phone at <a href="tel:+918291090155" style="color: #1D3530; text-decoration: underline; font-weight: 600;">+91 82910 90155</a>.
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
                Western Suburbs &amp; South Mumbai Luxury Advisory • Mumbai, Maharashtra
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
HTML;

// 5. Dispatch Live Email (Resend API with Hostinger Server Fallback)
$dispatchResult = dispatch_email($normalizedEmail, $subject, $htmlContent);

// 6. Record Rate Limit Attempt
record_rate_limit_attempt($normalizedEmail);
record_rate_limit_attempt($ipRateKey);

// 7. Store Hashed OTP in Secure Atomic JSON Store
$now = time();
$otpStore = read_json_data('otp_store.json');

// Clean up expired OTPs automatically
foreach ($otpStore as $k => $v) {
    if ($now > $v['expiresAt']) {
        unset($otpStore[$k]);
    }
}

$otpStore[$normalizedEmail] = [
    'hashedOtp' => $hashedOtp,
    'salt' => $salt,
    'expiresAt' => $now + OTP_TTL_SECONDS,
    'attempts' => 0,
    'lastSentAt' => $now,
    'digits' => $digits
];

write_json_data('otp_store.json', $otpStore);

// 8. Return Success JSON Response
http_response_code(200);
echo json_encode([
    'success' => true,
    'messageId' => isset($dispatchResult['id']) ? $dispatchResult['id'] : null,
    'emailDispatched' => !empty($dispatchResult['success']),
    'cooldownSeconds' => 60,
    'expiresInSeconds' => 300,
    'message' => "Verification code successfully dispatched to {$normalizedEmail}."
]);
exit;
