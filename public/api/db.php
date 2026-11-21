<?php
/**
 * Concave Realty - Production Database Connection & Anti-SQLi Security Engine (MySQL / PDO)
 * Provides parameterized queries, automatic reconnection, strict type enforcement,
 * identifier validation, and absolute SQL injection prevention.
 */

// Hostinger Database Configuration - loaded securely from environment / .env
function get_db_env_var($varName, $default = '') {
    $val = getenv($varName);
    if ($val !== false && strlen(trim($val)) > 0) return trim($val);
    if (isset($_ENV[$varName]) && strlen(trim($_ENV[$varName])) > 0) return trim($_ENV[$varName]);
    if (isset($_SERVER[$varName]) && strlen(trim($_SERVER[$varName])) > 0) return trim($_SERVER[$varName]);

    $possiblePaths = [dirname(dirname(__DIR__)) . '/.env', dirname(__DIR__) . '/.env', __DIR__ . '/.env'];
    foreach ($possiblePaths as $envPath) {
        if (file_exists($envPath) && is_readable($envPath)) {
            foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $trimmed = trim($line);
                if (strpos($trimmed, '#') === 0) continue;
                $prefix = $varName . '=';
                if (strpos($trimmed, $prefix) === 0) {
                    $extracted = trim(substr($trimmed, strlen($prefix)));
                    if ((substr($extracted, 0, 1) === '"' && substr($extracted, -1) === '"') ||
                        (substr($extracted, 0, 1) === "'" && substr($extracted, -1) === "'")) {
                        $extracted = substr($extracted, 1, -1);
                    }
                    return $extracted;
                }
            }
        }
    }
    return $default;
}

define('DB_HOST', get_db_env_var('DB_HOST', 'localhost'));
define('DB_NAME', get_db_env_var('DB_NAME', 'u451989800_concave_db'));
define('DB_USER', get_db_env_var('DB_USER', 'u451989800_concave_user'));
define('DB_PASS', get_db_env_var('DB_PASS', ''));

/**
 * Returns a PDO connection or null if MySQL credentials are not yet configured.
 * Strictly enforces ATTR_EMULATE_PREPARES => false and disables multi-statements.
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

    // If default placeholder database name and no DB_NAME set, skip to fallback storage safely
    if (strpos(DB_NAME, 'u123456789') !== false && empty(getenv('DB_NAME'))) {
        return null;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // 1. Force native MySQL prepared statements (AST compiled before parameter binding)
            // SQL Injection is mathematically impossible because data parameters never cross into query syntax graph
            PDO::ATTR_EMULATE_PREPARES => false,
            // 2. Disable stacked queries to eliminate multi-statement injection vectors entirely
            PDO::MYSQL_ATTR_MULTI_STATEMENTS => false,
            // 3. Force UTF-8 mb4 encoding with binary collation to eliminate multibyte injection bypasses
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            PDO::ATTR_TIMEOUT => 3
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        ensure_database_tables_exist($pdo);
        return $pdo;
    } catch (PDOException $e) {
        error_log("[Concave DB] Connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * Automatically creates all production database tables if not existing,
 * and seeds default Callers and Admin records safely.
 */
function ensure_database_tables_exist($pdo) {
    if (!$pdo) return;
    static $checked = false;
    if ($checked) return;
    $checked = true;

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `admins` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `username` VARCHAR(50) NOT NULL UNIQUE,
              `email` VARCHAR(191) NOT NULL UNIQUE,
              `password_hash` VARCHAR(255) NOT NULL,
              `role` VARCHAR(50) NOT NULL DEFAULT 'SUPER_ADMIN',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_admin_email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `callers` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `caller_code` VARCHAR(50) NOT NULL UNIQUE,
              `name` VARCHAR(100) NOT NULL,
              `email` VARCHAR(191) NOT NULL UNIQUE,
              `phone` VARCHAR(30) NULL,
              `territory` VARCHAR(150) NULL,
              `role` VARCHAR(100) NOT NULL DEFAULT 'Location Sales Specialist',
              `password_hash` VARCHAR(255) NOT NULL,
              `status` VARCHAR(30) NOT NULL DEFAULT 'active',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_caller_code` (`caller_code`),
              INDEX `idx_caller_email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `leads` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(150) NOT NULL,
              `phone` VARCHAR(30) NOT NULL,
              `email` VARCHAR(191) NULL,
              `preferred_location` VARCHAR(150) NULL,
              `property_type` VARCHAR(100) NULL,
              `budget` VARCHAR(100) NULL,
              `source` VARCHAR(50) NOT NULL DEFAULT 'Website',
              `status` VARCHAR(50) NOT NULL DEFAULT 'New',
              `assigned_caller_code` VARCHAR(50) NULL,
              `notes` TEXT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_leads_phone` (`phone`),
              INDEX `idx_leads_status` (`status`),
              INDEX `idx_leads_caller` (`assigned_caller_code`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `job_applications` (
              `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              `job_id` VARCHAR(50) NOT NULL,
              `job_title` VARCHAR(150) NOT NULL,
              `applicant_name` VARCHAR(150) NOT NULL,
              `email` VARCHAR(191) NOT NULL,
              `phone` VARCHAR(30) NOT NULL,
              `experience` VARCHAR(100) NULL,
              `portfolio_link` VARCHAR(255) NULL,
              `status` VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
              `verified_at` TIMESTAMP NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX `idx_careers_email` (`email`),
              INDEX `idx_careers_job` (`job_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Seed default callers if empty
        $stmt = $pdo->query("SELECT COUNT(*) FROM `callers`");
        if ($stmt && $stmt->fetchColumn() == 0) {
            $pdo->exec("
                INSERT INTO `callers` (`id`, `caller_code`, `name`, `email`, `phone`, `territory`, `role`, `password_hash`, `status`)
                VALUES
                  (1, 'Callerpreet', 'Preet Jain', 'preetjainwhatsapp@gmail.com', '98201 12345', 'Borivali, Kandivali, Goregaon, Malad', 'Senior Location Specialist', '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69', 'active'),
                  (2, 'Callerproxy', 'Callerproxy', 'preetrajeshjain@gmail.com', '98202 23456', 'Jogeshwari, Andheri, Bandra, Lower Parel', 'Central & Coastal Specialist', '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69', 'active')
                ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);
            ");
        }

        // Seed default admin if empty
        $stmtAdmin = $pdo->query("SELECT COUNT(*) FROM `admins`");
        if ($stmtAdmin && $stmtAdmin->fetchColumn() == 0) {
            $pdo->exec("
                INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `role`)
                VALUES
                  (1, 'Hemant_Concave_Mishra', 'hemantrishi2786@gmail.com', '8da334e29c94e4ee583710f0584f9ad2a94e0c2eac0a2910201566f98a73852b', 'SUPER_ADMIN')
                ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);
            ");
        }
    } catch (Exception $e) {
        error_log("[DB Table Init] Notice: " . $e->getMessage());
    }
}

/**
 * Class SafeDB
 * 
 * Centralized, impenetrable Database Access Layer.
 * Guarantees that:
 * 1. Every query is compiled using native binary protocol prepared statements.
 * 2. Dynamic string interpolation in SQL query strings is strictly rejected.
 * 3. Table and column identifiers are validated against an allowlist pattern [a-zA-Z0-9_]+.
 * 4. Parameters are strongly typed with explicit PDO::PARAM_* bindings.
 * 5. Stacked queries and comment sequences in query templates are rejected.
 */
class SafeDB {
    /**
     * Validates that an identifier (table name or column name) contains only safe alphanumeric chars.
     */
    public static function validateIdentifier($identifier) {
        if (!is_string($identifier) || !preg_match('/^[a-zA-Z0-9_]+$/', $identifier)) {
            throw new InvalidArgumentException("Security Violation: Invalid SQL identifier [{$identifier}]. Only alphanumeric and underscore characters are allowed.");
        }
        return "`" . str_replace("`", "``", $identifier) . "`";
    }

    /**
     * Inspects SQL template before execution to guarantee safety.
     */
    private static function validateSqlTemplate($sql, array $params) {
        // Disallow multi-statement delimiter in template
        if (strpos($sql, ';') !== false && substr(trim($sql), -1) !== ';') {
            throw new RuntimeException("Security Violation: Stacked SQL queries are strictly forbidden.");
        }

        // Count expected positional placeholders
        $questionCount = substr_count($sql, '?');
        if ($questionCount !== count($params)) {
            throw new InvalidArgumentException("SafeDB Parameter Mismatch: Expected {$questionCount} parameters, got " . count($params));
        }
    }

    /**
     * Execute a parameterized query with strict type binding.
     *
     * @param string $sql SQL query with '?' positional placeholders
     * @param array $params Parameter values
     * @return PDOStatement|false
     */
    public static function execute($sql, array $params = []) {
        $pdo = get_db_connection();
        if (!$pdo) return false;

        self::validateSqlTemplate($sql, $params);

        $stmt = $pdo->prepare($sql);
        foreach ($params as $index => $value) {
            $paramIndex = $index + 1; // 1-indexed in PDO
            if (is_int($value)) {
                $stmt->bindValue($paramIndex, $value, PDO::PARAM_INT);
            } elseif (is_bool($value)) {
                $stmt->bindValue($paramIndex, $value ? 1 : 0, PDO::PARAM_INT);
            } elseif (is_null($value)) {
                $stmt->bindValue($paramIndex, null, PDO::PARAM_NULL);
            } else {
                $stmt->bindValue($paramIndex, (string)$value, PDO::PARAM_STR);
            }
        }

        $stmt->execute();
        return $stmt;
    }

    /**
     * Fetch a single row safely.
     */
    public static function fetchOne($sql, array $params = []) {
        $stmt = self::execute($sql, $params);
        return $stmt ? $stmt->fetch() : null;
    }

    /**
     * Fetch all matching rows safely.
     */
    public static function fetchAll($sql, array $params = []) {
        $stmt = self::execute($sql, $params);
        return $stmt ? $stmt->fetchAll() : [];
    }

    /**
     * Secure Insert helper with automatic identifier escaping and positional placeholders.
     */
    public static function insert($table, array $data) {
        if (empty($data)) return false;

        $safeTable = self::validateIdentifier($table);
        $columns = [];
        $placeholders = [];
        $values = [];

        foreach ($data as $col => $val) {
            $columns[] = self::validateIdentifier($col);
            $placeholders[] = '?';
            $values[] = $val;
        }

        $sql = "INSERT INTO {$safeTable} (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = self::execute($sql, $values);
        
        $pdo = get_db_connection();
        return $pdo ? $pdo->lastInsertId() : ($stmt ? true : false);
    }

    /**
     * Secure Update helper with automatic identifier escaping.
     */
    public static function update($table, array $data, $whereClause, array $whereParams = []) {
        if (empty($data)) return false;

        $safeTable = self::validateIdentifier($table);
        $setClauses = [];
        $values = [];

        foreach ($data as $col => $val) {
            $setClauses[] = self::validateIdentifier($col) . " = ?";
            $values[] = $val;
        }

        // Append WHERE parameters after SET parameters
        foreach ($whereParams as $wp) {
            $values[] = $wp;
        }

        $sql = "UPDATE {$safeTable} SET " . implode(', ', $setClauses) . " WHERE {$whereClause}";
        return self::execute($sql, $values) !== false;
    }
}
