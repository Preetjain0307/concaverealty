<?php
/**
 * Concave Realty - POST /api/verify-otp
 * Shared Hosting PHP Endpoint for Timing-Safe HMAC OTP Verification
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
$otp = isset($data['otp']) ? trim($data['otp']) : '';

if (empty($otp)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'OTP verification code is required.']);
    exit;
}

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email address is required.']);
    exit;
}

$normalizedEmail = strtolower($email);
$now = time();

$otpStore = read_json_data('otp_store.json');

if (!isset($otpStore[$normalizedEmail])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No OTP requested for this email address. Please click Send OTP first.'
    ]);
    exit;
}

$record = $otpStore[$normalizedEmail];

// 2. Check 5-Minute Expiry
if ($now > $record['expiresAt']) {
    unset($otpStore[$normalizedEmail]);
    write_json_data('otp_store.json', $otpStore);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'OTP_EXPIRED',
        'message' => 'OTP has expired (5-minute limit). Please request a new code.'
    ]);
    exit;
}

// 3. Brute-Force Protection: Maximum 5 verification attempts
if ($record['attempts'] >= MAX_VERIFY_ATTEMPTS) {
    unset($otpStore[$normalizedEmail]);
    write_json_data('otp_store.json', $otpStore);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'MAX_ATTEMPTS_EXCEEDED',
        'message' => 'Maximum verification attempts exceeded (5/5). Please request a new OTP.'
    ]);
    exit;
}

// 4. Timing-Safe Hash Verification
$computedHash = hash_otp_code($otp, $record['salt']);
$isMatch = hash_equals($record['hashedOtp'], $computedHash);

if (!$isMatch) {
    $record['attempts'] += 1;
    $otpStore[$normalizedEmail] = $record;
    $remaining = MAX_VERIFY_ATTEMPTS - $record['attempts'];

    if ($remaining <= 0) {
        unset($otpStore[$normalizedEmail]);
        write_json_data('otp_store.json', $otpStore);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'code' => 'MAX_ATTEMPTS_EXCEEDED',
            'message' => 'Maximum verification attempts exceeded (5/5). Please request a new OTP.'
        ]);
        exit;
    }

    write_json_data('otp_store.json', $otpStore);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'remainingAttempts' => $remaining,
        'message' => "Invalid OTP. Please check your email. ({$remaining} attempt" . ($remaining > 1 ? 's' : '') . " remaining)"
    ]);
    exit;
}

// 5. Verification Successful
// Invalidate OTP immediately to prevent reuse
unset($otpStore[$normalizedEmail]);
write_json_data('otp_store.json', $otpStore);

// 6. Generate Cryptographically Signed Verification Token
$token = generate_verification_token($normalizedEmail);

// Record in verified sessions store (30-minute validity)
$sessions = read_json_data('verified_sessions.json');

// Clean up expired sessions
foreach ($sessions as $k => $v) {
    if ($now > $v['expiresAt']) {
        unset($sessions[$k]);
    }
}

$sessions[$normalizedEmail] = [
    'token' => $token,
    'verifiedAt' => $now,
    'expiresAt' => $now + 1800 // 30 minutes
];
write_json_data('verified_sessions.json', $sessions);

// 7. Return JSON Success
http_response_code(200);
echo json_encode([
    'success' => true,
    'verified' => true,
    'token' => $token,
    'message' => 'Email Verified Successfully.'
]);
exit;
