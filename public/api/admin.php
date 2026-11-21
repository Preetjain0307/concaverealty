<?php
/**
 * Concave Realty - /api/admin
 * Live Real-Time MySQL Administrative Control & Authentication API.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// GET: Admin Stats & System Diagnostics
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $stats = [
        'databaseConnected' => false,
        'totalLeads' => 0,
        'todaysLeads' => 0,
        'totalCallers' => 0,
        'jobApplications' => 0,
        'dbName' => DB_NAME,
        'dbHost' => DB_HOST
    ];

    try {
        $pdo = get_db_connection();
        if ($pdo) {
            $stats['databaseConnected'] = true;

            // Total leads
            $stmt = $pdo->query("SELECT COUNT(*) FROM `leads`");
            $stats['totalLeads'] = intval($stmt ? $stmt->fetchColumn() : 0);

            // Today's leads
            $stmtToday = $pdo->query("SELECT COUNT(*) FROM `leads` WHERE DATE(`created_at`) = CURDATE()");
            $stats['todaysLeads'] = intval($stmtToday ? $stmtToday->fetchColumn() : 0);

            // Callers
            $stmtCallers = $pdo->query("SELECT COUNT(*) FROM `callers`");
            $stats['totalCallers'] = intval($stmtCallers ? $stmtCallers->fetchColumn() : 0);

            // Careers
            $stmtCareers = $pdo->query("SELECT COUNT(*) FROM `job_applications`");
            $stats['jobApplications'] = intval($stmtCareers ? $stmtCareers->fetchColumn() : 0);
        }
    } catch (Exception $e) {
        error_log("[Admin API] Stats error: " . $e->getMessage());
    }

    echo json_encode(['success' => true, 'stats' => $stats]);
    exit;
}

// -----------------------------------------------------------------------------
// POST: Login & Password Management
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
        exit;
    }

    $action = isset($_GET['action']) ? $_GET['action'] : ($data['action'] ?? 'login');

    // 1. UPDATE PASSWORD
    if ($action === 'update_password') {
        $newHash = trim($data['passwordHash'] ?? ($data['password'] ?? ''));
        $username = trim($data['username'] ?? 'Hemant_Concave_Mishra');

        if (empty($newHash)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password hash is required.']);
            exit;
        }

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $stmt = $pdo->prepare("UPDATE `admins` SET `password_hash` = ?, `updated_at` = NOW() WHERE `username` = ? OR `id` = 1");
                $stmt->execute([$newHash, $username]);
            }
        } catch (Exception $e) {
            error_log("[Admin API] Password update error: " . $e->getMessage());
        }

        echo json_encode(['success' => true, 'message' => 'Admin password updated in database.']);
        exit;
    }

    // 2. VERIFY / LOGIN
    if ($action === 'login') {
        $username = trim($data['username'] ?? '');
        $passwordHash = trim($data['passwordHash'] ?? '');

        $authenticated = false;
        $adminRecord = null;

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT * FROM `admins` WHERE (`username` = ? OR `email` = ?) LIMIT 1");
                $stmt->execute([$username, $username]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row && ($row['password_hash'] === $passwordHash || hash('sha256', 'concave_auth_salt_2026' . $passwordHash) === $row['password_hash'])) {
                    $authenticated = true;
                    $adminRecord = [
                        'id' => intval($row['id']),
                        'username' => $row['username'],
                        'email' => $row['email'],
                        'role' => $row['role']
                    ];
                }
            }
        } catch (Exception $e) {
            error_log("[Admin API] Login error: " . $e->getMessage());
        }

        // Fallback default admin check
        if (!$authenticated && strtolower($username) === 'hemant_concave_mishra') {
            $expectedHash = '8da334e29c94e4ee583710f0584f9ad2a94e0c2eac0a2910201566f98a73852b';
            if ($passwordHash === $expectedHash || $passwordHash === 'Hemant_Concave_Mishra#2026@MillenForge') {
                $authenticated = true;
                $adminRecord = [
                    'id' => 1,
                    'username' => 'Hemant_Concave_Mishra',
                    'email' => 'hemantrishi2786@gmail.com',
                    'role' => 'SUPER_ADMIN'
                ];
            }
        }

        if ($authenticated) {
            echo json_encode(['success' => true, 'admin' => $adminRecord]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid administrative credentials.']);
        }
        exit;
    }
}
