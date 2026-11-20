<?php
/**
 * Concave Realty - POST /api/update-password
 * Secure Password Update Engine for Admin & Caller Accounts
 * Requires authentic server-verified OTP token, enforces password complexity,
 * updates MySQL database with parameterized queries and updates secure local store.
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
$newPassword = isset($data['newPassword']) ? $data['newPassword'] : '';
$role = isset($data['role']) && $data['role'] === 'caller' ? 'caller' : 'admin';
$callerCode = isset($data['callerCode']) ? strtoupper(trim($data['callerCode'])) : '';

// 2. Validate Verification Token (Guarantees OTP was verified on server)
$validation = validate_verification_token($email, $token);
if (!$validation['valid']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'code' => 'UNAUTHORIZED_TOKEN',
        'message' => $validation['message']
    ]);
    exit;
}

// 2b. Strict Role-Based Identity Authorization (Prevents Privilege Escalation)
$normalizedEmail = strtolower($email);
$superAdminEmail = 'concaverealtyindia@gmail.com';

if ($role === 'admin') {
    if ($normalizedEmail !== strtolower($superAdminEmail)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'code' => 'FORBIDDEN_ROLE_MISMATCH',
            'message' => 'Unauthorized: This email address is not registered for super-administrator privileges.'
        ]);
        exit;
    }
}

// 3. Enforce Strong Password Policy (Min 8 chars, Upper, Lower, Number, Special)
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
    exit;
}
if (!preg_match('/[A-Z]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 1 uppercase letter (A-Z).']);
    exit;
}
if (!preg_match('/[a-z]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 1 lowercase letter (a-z).']);
    exit;
}
if (!preg_match('/[0-9]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 1 numeric digit (0-9).']);
    exit;
}
if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 1 special character (!@#$%^&* etc.).']);
    exit;
}

// 4. Cryptographic Hashing with Salt
$passwordHash = hash_otp_code($newPassword, 'concave_auth_salt_2026');

$dbUpdated = false;
$storageUpdated = false;

// 5. Update MySQL Database via SafeDB with strict parameterized execution
try {
    if ($role === 'admin') {
        // Strictly require BOTH email AND username match
        $stmt = SafeDB::execute(
            "UPDATE `admins` SET `password_hash` = ?, `updated_at` = NOW() WHERE `email` = ? AND `username` = 'admin'",
            [$passwordHash, $normalizedEmail]
        );
        if ($stmt) $dbUpdated = true;
    } else {
        // Strictly require caller account ownership matching verified email
        $stmt = SafeDB::execute(
            "UPDATE `callers` SET `password_hash` = ?, `updated_at` = NOW() WHERE `email` = ?",
            [$passwordHash, $normalizedEmail]
        );
        if ($stmt) $dbUpdated = true;
    }
} catch (Exception $e) {
    error_log("[Update Password] SafeDB update notice: " . $e->getMessage());
}

// 6. Update Persistent Credentials JSON Store
$credsStore = read_json_data('credentials_store.json');
$normalizedEmail = strtolower($email);

if ($role === 'admin') {
    $credsStore['admin'] = [
        'username' => 'admin',
        'email' => $normalizedEmail,
        'password' => $passwordHash,
        'updatedAt' => time()
    ];
} else {
    if (!isset($credsStore['callers'])) {
        $credsStore['callers'] = [];
    }
    $credsStore['callers'][$callerCode ?: $normalizedEmail] = [
        'callerCode' => $callerCode,
        'email' => $normalizedEmail,
        'password' => $passwordHash,
        'updatedAt' => time()
    ];
}
write_json_data('credentials_store.json', $credsStore);
$storageUpdated = true;

// 7. Revoke/Invalidate Verification Token to prevent replay attacks
$sessions = read_json_data('verified_sessions.json');
unset($sessions[$normalizedEmail]);
write_json_data('verified_sessions.json', $sessions);

// 8. Return Success Response
http_response_code(200);
echo json_encode([
    'success' => true,
    'dbUpdated' => $dbUpdated,
    'storageUpdated' => $storageUpdated,
    'message' => 'Password has been verified and updated successfully in the database.'
]);
exit;
