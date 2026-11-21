<?php
/**
 * Concave Realty - Safe Database Initialization & Diagnostic Endpoint
 * Access: /api/db-init.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
send_json_headers();

$response = [
    'success' => false,
    'databaseHost' => DB_HOST,
    'databaseName' => DB_NAME,
    'connected' => false,
    'tables' => [],
    'error' => null
];

try {
    $pdo = get_db_connection();
    if (!$pdo) {
        $response['error'] = 'Database connection returned null. Check .env credentials.';
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit;
    }

    $response['connected'] = true;

    // Check tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt ? $stmt->fetchAll(PDO::FETCH_COLUMN) : [];
    $response['tables'] = $tables;
    $response['success'] = true;
    $response['message'] = 'Database connected and verified successfully.';
} catch (\Throwable $t) {
    $response['error'] = $t->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
exit;
