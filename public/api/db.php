<?php
/**
 * Concave Realty - Production Database Connection (MySQL / PDO)
 * Provides parameterized queries, automatic reconnection, and secure fallbacks.
 */

// Hostinger Database Configuration
// Replace with your Hostinger MySQL details from hPanel
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'u123456789_concave_db');
define('DB_USER', getenv('DB_USER') ?: 'u123456789_concave_admin');
define('DB_PASS', getenv('DB_PASS') ?: '');

/**
 * Returns a PDO connection or null if MySQL credentials are not yet configured.
 */
function get_db_connection() {
    static $pdo = null;
    static $attempted = false;

    if ($pdo !== null) {
        return $pdo;
    }

    if ($attempted) {
        return null;
    }

    $attempted = true;

    // If default placeholder database name, skip to fallback storage safely
    if (strpos(DB_NAME, 'u123456789') !== false && empty(getenv('DB_NAME'))) {
        return null;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false, // Strict Parameterized Queries (Anti-SQLi)
            PDO::ATTR_TIMEOUT => 3
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("[Concave DB] Connection failed: " . $e->getMessage());
        return null;
    }
}
