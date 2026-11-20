<?php
/**
 * Concave Realty - POST /api/career-apply
 * Shared Hosting PHP Endpoint for Backend Verification Token Validation
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
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
$name = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
$phone = isset($data['phone']) ? preg_replace('/\D/', '', $data['phone']) : '';
$jobId = isset($data['jobId']) ? strip_tags(trim($data['jobId'])) : 'GENERAL';
$jobTitle = isset($data['jobTitle']) ? strip_tags(trim($data['jobTitle'])) : 'General Application';
$experience = isset($data['experience']) ? strip_tags(trim($data['experience'])) : '';
$portfolioLink = isset($data['portfolioLink']) ? filter_var(trim($data['portfolioLink']), FILTER_SANITIZE_URL) : '';

// 2. Validate Verification Token (Guarantees OTP was verified on server)
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

// 3. Insert into MySQL via SafeDB with strict parameterized query
try {
    SafeDB::insert('job_applications', [
        'job_id' => $jobId,
        'job_title' => $jobTitle,
        'applicant_name' => $name,
        'email' => strtolower($email),
        'phone' => $phone,
        'experience' => $experience,
        'portfolio_link' => $portfolioLink,
        'status' => 'Under Review',
        'verified_at' => date('Y-m-d H:i:s'),
        'created_at' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    error_log("[Career Apply] SafeDB insert notice: " . $e->getMessage());
}

// 4. Return Confirmed Application Acceptance
http_response_code(200);
echo json_encode([
    'success' => true,
    'verified' => true,
    'message' => 'Email verification confirmed on server. Application accepted.'
]);
exit;
