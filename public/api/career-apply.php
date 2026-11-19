<?php
/**
 * Concave Realty - POST /api/career-apply
 * Shared Hosting PHP Endpoint for Backend Verification Token Validation
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
$token = isset($data['verificationToken']) ? trim($data['verificationToken']) : '';

// 2. Validate Verification Token
$validation = validate_verification_token($email, $token);

if (!$validation['valid']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'code' => 'EMAIL_UNVERIFIED',
        'message' => isset($validation['message']) ? $validation['message'] : 'Please verify your email address before submitting your application.'
    ]);
    exit;
}

// 3. Return Confirmed Application Acceptance
http_response_code(200);
echo json_encode([
    'success' => true,
    'verified' => true,
    'message' => 'Email verification confirmed on server. Application accepted.'
]);
exit;
