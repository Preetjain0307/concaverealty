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
        // Non-whitelisted origin: strictly reject POST requests
        header('Access-Control-Allow-Origin: null');
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden: Cross-origin request blocked by security policy.']);
            exit;
        }
    }
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Handle pre-flight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    // 2b. Application Security Firewall: Real-Time Anti-SQLi Request Inspector
    inspect_request_for_sqli();
}

// 2c. Real-Time SQL Injection WAF Shield
function inspect_request_for_sqli() {
    $sqliSignatures = [
        '/\b(union\s+(all\s+)?select)\b/i',
        '/\b(information_schema|sys\.tables|pg_catalog|sqlite_master)\b/i',
        '/\b(sleep|benchmark)\s*\(/i',
        '/\b(into\s+(outfile|dumpfile))\b/i',
        '/\b(load_file)\s*\(/i',
        '/\b(waitfor\s+delay)\b/i',
        '/\b(exec|execute)\s*\(.*xp_/i',
        '/(--\s*$|\/\*.*?\*\/|;\s*(select|insert|update|delete|drop|alter|truncate|create|exec)\b)/is',
        '/\b(or|and)\s+[\d\w\'"]+\s*=\s*[\d\w\'"]+/i'
    ];

    $checkValue = function($val, $key = '') use (&$checkValue, $sqliSignatures) {
        if (is_array($val)) {
            foreach ($val as $k => $v) {
                $checkValue($v, $k);
            }
            return;
        }

        if (is_string($val) && strlen($val) > 1) {
            // Check for null-byte injection
            if (strpos($val, "\0") !== false) {
                block_sqli_attack('Null byte injection detected in parameter: ' . $key);
            }

            foreach ($sqliSignatures as $pattern) {
                if (preg_match($pattern, $val)) {
                    block_sqli_attack("SQLi signature matched in parameter [{$key}]: pattern {$pattern}");
                }
            }
        }
    };

    if (!empty($_GET)) {
        $checkValue($_GET);
    }
    if (!empty($_POST)) {
        $checkValue($_POST);
    }
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $checkValue($decoded);
            }
        }
    }
}

function block_sqli_attack($reason) {
    $ip = get_client_ip();
    $logEntry = sprintf(
        "[%s] [SECURITY ALERT - SQLi BLOCKED] IP: %s | URL: %s | Reason: %s | User-Agent: %s\n",
        date('Y-m-d H:i:s'),
        $ip,
        isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : 'Unknown',
        $reason,
        isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown'
    );
    
    @file_put_contents(DATA_DIR . '/security_violations.log', $logEntry, FILE_APPEND | LOCK_EX);
    
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'code' => 'WAF_SQLI_BLOCKED',
        'message' => 'Request blocked by Application Security Firewall (Anti-SQLi Rule Triggered).'
    ]);
    exit;
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

// 5. Rate Limiting Check (Dual Layer: Email & IP)
function check_rate_limit($identifier, $maxAttempts = MAX_ATTEMPTS_PER_WINDOW, $cooldown = SEND_COOLDOWN_SECONDS) {
    $cleanId = strtolower(trim($identifier));
    if (empty($cleanId)) return ['allowed' => true];

    $now = time();
    $history = read_json_data('rate_limits.json');
    $attempts = isset($history[$cleanId]) ? $history[$cleanId] : [];

    // Filter attempts to strictly within 4-hour window
    $recentAttempts = array_values(array_filter($attempts, function($ts) use ($now) {
        return ($now - $ts) < FOUR_HOURS_SECONDS;
    }));

    // Check maximum attempts per 4 hours
    if (count($recentAttempts) >= $maxAttempts) {
        $oldest = min($recentAttempts);
        $resetAt = $oldest + FOUR_HOURS_SECONDS;
        $remainingSec = max(0, $resetAt - $now);
        $hours = floor($remainingSec / 3600);
        $minutes = ceil(($remainingSec % 3600) / 60);
        $timeStr = $hours > 0 ? "{$hours}h {$minutes}m" : "{$minutes} minutes";

        return [
            'allowed' => false,
            'code' => 'MAX_ATTEMPTS_EXCEEDED',
            'message' => "Security limit reached: Maximum {$maxAttempts} OTP attempts allowed per 4 hours. Cooldown active for another {$timeStr}."
        ];
    }

    // Check cooldown between consecutive requests if cooldown > 0
    if ($cooldown > 0 && count($recentAttempts) > 0) {
        $lastAttempt = end($recentAttempts);
        $diff = $now - $lastAttempt;
        if ($diff < $cooldown) {
            $remainingSeconds = $cooldown - $diff;
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
        'remainingAttempts' => $maxAttempts - count($recentAttempts)
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

// 8. Direct Hostinger SMTP Client (Pure PHP - SSL Port 465 / TLS Port 587)
function dispatch_smtp_email($toEmail, $subject, $htmlContent) {
    $smtpHost = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
    $smtpPort = intval(getenv('SMTP_PORT') ?: 465);
    $smtpUser = getenv('SMTP_USER') ?: '';
    $smtpPass = getenv('SMTP_PASS') ?: '';
    $fromEmail = getenv('SMTP_FROM') ?: $smtpUser;

    if (empty($smtpUser) || empty($smtpPass)) {
        return ['success' => false, 'error' => 'SMTP credentials not configured'];
    }

    $socketProtocol = ($smtpPort === 465) ? 'ssl://' : '';
    $socket = @fsockopen($socketProtocol . $smtpHost, $smtpPort, $errno, $errstr, 15);
    if (!$socket) {
        return ['success' => false, 'error' => "SMTP Connection failed: {$errstr} ({$errno})"];
    }

    $read = function() use ($socket) {
        $res = '';
        while ($line = fgets($socket, 515)) {
            $res .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $res;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read();
    $write("EHLO " . (!empty($_SERVER['HTTP_HOST']) ? preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST']) : 'concaverealty.com'));
    $read();

    $write("AUTH LOGIN");
    $read();
    $write(base64_encode($smtpUser));
    $read();
    $write(base64_encode($smtpPass));
    $authRes = $read();

    if (strpos($authRes, '235') === false) {
        fclose($socket);
        return ['success' => false, 'error' => 'SMTP Authentication failed: ' . trim($authRes)];
    }

    $write("MAIL FROM: <{$fromEmail}>");
    $read();
    $write("RCPT TO: <{$toEmail}>");
    $read();
    $write("DATA");
    $read();

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Concave Realty <{$fromEmail}>\r\n";
    $headers .= "Reply-To: concaverealtyindia@gmail.com\r\n";
    $headers .= "To: {$toEmail}\r\n";
    $headers .= "Subject: {$subject}\r\n";

    $write($headers . "\r\n" . $htmlContent . "\r\n.");
    $sendRes = $read();
    $write("QUIT");
    fclose($socket);

    if (strpos($sendRes, '250') !== false) {
        return ['success' => true, 'id' => 'smtp_' . time()];
    }

    return ['success' => false, 'error' => 'SMTP dispatch rejected: ' . trim($sendRes)];
}

// 9. Hybrid Email Dispatch Engine (Resend API -> Hostinger SMTP -> Native Mail Fallback)
function dispatch_email($toEmail, $subject, $htmlContent) {
    // Attempt 1: Fast delivery via Resend API
    $resendResult = dispatch_resend_email($toEmail, $subject, $htmlContent);
    if ($resendResult['success']) {
        return $resendResult;
    }

    // Attempt 2: Direct Hostinger SMTP delivery (if configured)
    $smtpResult = dispatch_smtp_email($toEmail, $subject, $htmlContent);
    if ($smtpResult['success']) {
        return $smtpResult;
    }

    // Attempt 3: Fallback to Hostinger's native server mail()
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
