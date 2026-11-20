<?php
/**
 * Concave Realty - Production PHP Configuration & Security Engine
 * Purpose: Provides Resend API integration, HMAC cryptographic hashing,
 * sliding-window rate limiting, and secure atomic JSON storage for shared hosting.
 */

// Strict error reporting in production (log errors, never display sensitive data to user)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Security Constants
define('OTP_TTL_SECONDS', 300);          // 5 minutes strictly
define('SEND_COOLDOWN_SECONDS', 60);     // 60-second cooldown
define('FOUR_HOURS_SECONDS', 14400);     // 4 hours lockout window
define('MAX_ATTEMPTS_PER_WINDOW', 5);    // Max 5 OTP sends per 4 hours
define('MAX_VERIFY_ATTEMPTS', 5);        // Max 5 incorrect OTP attempts
define('OTP_PEPPER', 'concave_realty_otp_pepper_2026');
define('VERIFICATION_SECRET', 'concave_career_verified_token_sec_2026');

// Safe Directory Paths
define('DATA_DIR', __DIR__ . '/data');
if (!is_dir(DATA_DIR)) {
    @mkdir(DATA_DIR, 0755, true);
}

// 1. Resolve RESEND_API_KEY from environment or .env file
function get_resend_api_key() {
    $key = getenv('RESEND_API_KEY');
    if ($key && strlen(trim($key)) > 5) {
        return trim($key);
    }

    // Try reading .env from root or parent directory
    $possiblePaths = [
        dirname(dirname(__DIR__)) . '/.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env'
    ];

    foreach ($possiblePaths as $envPath) {
        if (file_exists($envPath) && is_readable($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, 'RESEND_API_KEY=') === 0) {
                    return trim(substr($line, strlen('RESEND_API_KEY=')));
                }
            }
        }
    }

    return '';
}

// 2. Global Security & CORS Headers
function send_json_headers() {
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // Strict CORS Whitelist
    $allowedOrigins = [
        'https://concaverealty.com',
        'https://www.concaverealty.com',
        'http://localhost:5180',
        'http://localhost:5173',
        'http://127.0.0.1:5180',
        'http://127.0.0.1:5173'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    $isAllowed = in_array($origin, $allowedOrigins, true) || 
                 preg_match('/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/', $origin);

    if ($isAllowed) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
    } elseif (empty($origin)) {
        // Same-origin request
        header('Access-Control-Allow-Origin: *');
    } else {
        // Non-whitelisted origin: deny credentials
        header('Access-Control-Allow-Origin: null');
    }
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Handle pre-flight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// 3. Client IP Resolver
function get_client_ip() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return !empty($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
}

// 4. Safe Atomic File Read/Write Engine
function read_json_data($filename) {
    $filePath = DATA_DIR . '/' . $filename;
    if (!file_exists($filePath)) {
        return [];
    }

    $fp = @fopen($filePath, 'r');
    if (!$fp) return [];

    flock($fp, LOCK_SH);
    $content = '';
    while (!feof($fp)) {
        $content .= fread($fp, 8192);
    }
    flock($fp, LOCK_UN);
    fclose($fp);

    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

function write_json_data($filename, $data) {
    $filePath = DATA_DIR . '/' . $filename;
    $fp = @fopen($filePath, 'c+');
    if (!$fp) return false;

    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        return true;
    }

    fclose($fp);
    return false;
}

// 5. Rate Limiting Check
function check_rate_limit($identifier) {
    $cleanId = strtolower(trim($identifier));
    if (empty($cleanId)) return ['allowed' => true];

    $now = time();
    $history = read_json_data('rate_limits.json');
    $attempts = isset($history[$cleanId]) ? $history[$cleanId] : [];

    // Filter attempts to strictly within 4-hour window
    $recentAttempts = array_values(array_filter($attempts, function($ts) use ($now) {
        return ($now - $ts) < FOUR_HOURS_SECONDS;
    }));

    // Check maximum 5 attempts per 4 hours
    if (count($recentAttempts) >= MAX_ATTEMPTS_PER_WINDOW) {
        $oldest = min($recentAttempts);
        $resetAt = $oldest + FOUR_HOURS_SECONDS;
        $remainingSec = max(0, $resetAt - $now);
        $hours = floor($remainingSec / 3600);
        $minutes = ceil(($remainingSec % 3600) / 60);
        $timeStr = $hours > 0 ? "{$hours}h {$minutes}m" : "{$minutes} minutes";

        return [
            'allowed' => false,
            'code' => 'MAX_ATTEMPTS_EXCEEDED',
            'message' => "Security limit reached: Maximum 5 OTP attempts allowed per 4 hours. Cooldown active for another {$timeStr}."
        ];
    }

    // Check 60-second cooldown between consecutive requests
    if (count($recentAttempts) > 0) {
        $lastAttempt = end($recentAttempts);
        $diff = $now - $lastAttempt;
        if ($diff < SEND_COOLDOWN_SECONDS) {
            $remainingSeconds = SEND_COOLDOWN_SECONDS - $diff;
            return [
                'allowed' => false,
                'code' => 'COOLDOWN_ACTIVE',
                'remainingSeconds' => $remainingSeconds,
                'message' => "Please wait {$remainingSeconds} seconds before requesting a new OTP."
            ];
        }
    }

    return [
        'allowed' => true,
        'remainingAttempts' => MAX_ATTEMPTS_PER_WINDOW - count($recentAttempts)
    ];
}

function record_rate_limit_attempt($identifier) {
    $cleanId = strtolower(trim($identifier));
    if (empty($cleanId)) return;

    $now = time();
    $history = read_json_data('rate_limits.json');
    $attempts = isset($history[$cleanId]) ? $history[$cleanId] : [];

    $attempts[] = $now;
    $history[$cleanId] = array_values(array_filter($attempts, function($ts) use ($now) {
        return ($now - $ts) < FOUR_HOURS_SECONDS;
    }));

    write_json_data('rate_limits.json', $history);
}

// 6. Cryptographic OTP Hashing & Verification
function hash_otp_code($otp, $salt) {
    return hash_hmac('sha256', trim($otp), $salt . ':' . OTP_PEPPER);
}

function generate_verification_token($email) {
    $cleanEmail = strtolower(trim($email));
    $timestamp = time();
    $data = "{$cleanEmail}:{$timestamp}";
    $signature = hash_hmac('sha256', $data, VERIFICATION_SECRET);
    return "{$data}:{$signature}";
}

function validate_verification_token($email, $token) {
    if (empty($email) || empty($token)) {
        return ['valid' => false, 'message' => 'Please verify your email address before submitting your application.'];
    }

    $cleanEmail = strtolower(trim($email));
    $parts = explode(':', $token);
    if (count($parts) !== 3) {
        return ['valid' => false, 'message' => 'Invalid verification token format. Please re-verify your email.'];
    }

    list($tokenEmail, $timestampStr, $signature) = $parts;
    if ($tokenEmail !== $cleanEmail) {
        return ['valid' => false, 'message' => 'Verification token does not match the submitted email address.'];
    }

    $timestamp = intval($timestampStr);
    if (!$timestamp || (time() - $timestamp) > 1800) { // 30-minute validity
        return ['valid' => false, 'message' => 'Verification session expired (30-minute validity). Please verify again.'];
    }

    $data = "{$tokenEmail}:{$timestampStr}";
    $expectedSignature = hash_hmac('sha256', $data, VERIFICATION_SECRET);

    if (!hash_equals($expectedSignature, $signature)) {
        return ['valid' => false, 'message' => 'Cryptographic validation failed: Invalid token signature.'];
    }

    // Verify against session store
    $sessions = read_json_data('verified_sessions.json');
    if (!isset($sessions[$cleanEmail]) || $sessions[$cleanEmail]['token'] !== $token) {
        return ['valid' => false, 'message' => 'Email has not been verified on this server session.'];
    }

    if (time() > $sessions[$cleanEmail]['expiresAt']) {
        unset($sessions[$cleanEmail]);
        write_json_data('verified_sessions.json', $sessions);
        return ['valid' => false, 'message' => 'Email verification has expired. Please verify your email again.'];
    }

    return ['valid' => true];
}

// 7. Resend API Email Dispatch via cURL
function dispatch_resend_email($toEmail, $subject, $htmlContent) {
    $apiKey = get_resend_api_key();
    if (empty($apiKey) || strpos($apiKey, 'your_api_key') !== false) {
        return ['success' => false, 'error' => 'Resend API key not configured.'];
    }

    $payload = [
        'from' => 'Concave Realty <onboarding@resend.dev>',
        'to' => [$toEmail],
        'subject' => $subject,
        'html' => $htmlContent
    ];

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'User-Agent: ConcaveRealty-PHP/1.0'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['success' => false, 'error' => $curlError];
    }

    $responseData = json_decode($response, true);
    if ($httpCode >= 200 && $httpCode < 300) {
        return ['success' => true, 'id' => isset($responseData['id']) ? $responseData['id'] : null];
    }

    return [
        'success' => false,
        'error' => isset($responseData['message']) ? $responseData['message'] : 'Resend API error (' . $httpCode . ')'
    ];
}

// 8. Hybrid Email Dispatch Engine (Resend API with Hostinger Native Mail Fallback)
function dispatch_email($toEmail, $subject, $htmlContent) {
    // Attempt 1: Fast delivery via Resend API
    $resendResult = dispatch_resend_email($toEmail, $subject, $htmlContent);
    if ($resendResult['success']) {
        return $resendResult;
    }

    // Attempt 2: Fallback to Hostinger's native server mail()
    $host = !empty($_SERVER['HTTP_HOST']) ? preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST']) : 'concaverealty.com';
    $fromEmail = "no-reply@" . $host;

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Concave Realty <{$fromEmail}>\r\n";
    $headers .= "Reply-To: concaverealtyindia@gmail.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    $mailSent = @mail($toEmail, $subject, $htmlContent, $headers);
    if ($mailSent) {
        return ['success' => true, 'id' => 'hostinger_mail_' . time()];
    }

    return [
        'success' => false,
        'error' => isset($resendResult['error']) ? $resendResult['error'] : 'Email dispatch failed. Please verify mail settings.'
    ];
}
