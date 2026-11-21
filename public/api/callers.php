<?php
/**
 * Concave Realty - /api/callers
 * Live Real-Time MySQL Callers API with atomic JSON fallback.
 * Manages tele-sales caller accounts, territories, credentials, and live statuses.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// Location helper
$locationNameToId = [
    'borivali' => 1,
    'kandivali' => 2,
    'goregaon' => 3,
    'malad' => 4,
    'jogeshwari' => 5,
    'andheri' => 6,
    'bandra' => 7,
    'lower parel' => 8
];

function parse_territory_locations($territoryStr) {
    global $locationNameToId;
    if (empty($territoryStr)) return [1, 2, 3, 4];
    $parts = explode(',', strtolower($territoryStr));
    $ids = [];
    foreach ($parts as $p) {
        $clean = trim($p);
        if (isset($locationNameToId[$clean])) {
            $ids[] = $locationNameToId[$clean];
        }
    }
    return !empty($ids) ? array_unique($ids) : [1];
}

// -----------------------------------------------------------------------------
// GET: Fetch all active callers from live database
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $callers = [];

    // Attempt 1: Fetch from MySQL
    try {
        $pdo = get_db_connection();
        if ($pdo) {
            $stmt = $pdo->query("SELECT * FROM `callers` ORDER BY `id` ASC");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            if (!empty($rows)) {
                foreach ($rows as $row) {
                    $callers[] = [
                        'id' => intval($row['id']),
                        'callerCode' => $row['caller_code'],
                        'name' => $row['name'],
                        'email' => $row['email'],
                        'phone' => $row['phone'] ?? '',
                        'territory' => $row['territory'] ?? '',
                        'role' => $row['role'] ?? 'Location Sales Specialist',
                        'password' => $row['password_hash'],
                        'status' => $row['status'] ?? 'active',
                        'active' => ($row['status'] === 'active'),
                        'assignedLocations' => parse_territory_locations($row['territory'] ?? ''),
                        'createdAt' => !empty($row['created_at']) ? strtotime($row['created_at']) * 1000 : time() * 1000
                    ];
                }
            }
        }
    } catch (Exception $e) {
        error_log("[Callers API] MySQL fetch error: " . $e->getMessage());
    }

    // Attempt 2: Fallback to JSON store if MySQL empty
    if (empty($callers)) {
        $jsonCallers = read_json_data('callers_store.json');
        if (!empty($jsonCallers) && is_array($jsonCallers)) {
            $callers = $jsonCallers;
        } else {
            // Default seed
            $callers = [
                [
                    'id' => 1,
                    'callerCode' => 'Callerpreet',
                    'name' => 'Preet Jain',
                    'email' => 'preetjainwhatsapp@gmail.com',
                    'phone' => '98201 12345',
                    'territory' => 'Borivali, Kandivali, Goregaon, Malad',
                    'role' => 'Senior Location Specialist',
                    'password' => '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69',
                    'status' => 'active',
                    'active' => true,
                    'assignedLocations' => [1, 2, 3, 4],
                    'createdAt' => 1761935400000
                ],
                [
                    'id' => 2,
                    'callerCode' => 'Callerproxy',
                    'name' => 'Callerproxy',
                    'email' => 'preetrajeshjain@gmail.com',
                    'phone' => '98202 23456',
                    'territory' => 'Jogeshwari, Andheri, Bandra, Lower Parel',
                    'role' => 'Central & Coastal Specialist',
                    'password' => '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69',
                    'status' => 'active',
                    'active' => true,
                    'assignedLocations' => [5, 6, 7, 8],
                    'createdAt' => 1761935400000
                ]
            ];
            write_json_data('callers_store.json', $callers);
        }
    }

    echo json_encode([
        'success' => true,
        'count' => count($callers),
        'callers' => $callers
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// POST: Actions (save, delete, update_password, login)
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON body.']);
        exit;
    }

    $action = isset($_GET['action']) ? $_GET['action'] : ($data['action'] ?? 'save');

    // 1. SAVE (Add or Edit Caller)
    if ($action === 'save') {
        $callerId = intval($data['id'] ?? 0);
        $name = strip_tags(trim($data['name'] ?? ''));
        $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone = strip_tags(trim($data['phone'] ?? ''));
        $territory = strip_tags(trim($data['territory'] ?? ''));
        $role = strip_tags(trim($data['role'] ?? 'Location Sales Specialist'));
        $passwordHash = !empty($data['password']) ? trim($data['password']) : '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69';
        $status = ($data['active'] === false || $data['status'] === 'inactive') ? 'inactive' : 'active';

        if (empty($name) || empty($email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and email are required.']);
            exit;
        }

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                if ($callerId > 0) {
                    // Update
                    $stmt = $pdo->prepare("UPDATE `callers` SET `name` = ?, `email` = ?, `phone` = ?, `territory` = ?, `role` = ?, `status` = ?, `updated_at` = NOW() WHERE `id` = ?");
                    $stmt->execute([$name, $email, $phone, $territory, $role, $status, $callerId]);
                } else {
                    // Create new
                    $callerCode = !empty($data['callerCode']) ? strip_tags(trim($data['callerCode'])) : ('CALLER-' . rand(100, 999));
                    $stmt = $pdo->prepare("INSERT INTO `callers` (`caller_code`, `name`, `email`, `phone`, `territory`, `role`, `password_hash`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$callerCode, $name, $email, $phone, $territory, $role, $passwordHash, $status]);
                    $callerId = intval($pdo->lastInsertId());
                }
            }
        } catch (Exception $e) {
            error_log("[Callers API] Save error: " . $e->getMessage());
        }

        // Dual persist in JSON store
        $jsonCallers = read_json_data('callers_store.json');
        if (!is_array($jsonCallers)) $jsonCallers = [];
        $existingIdx = -1;
        foreach ($jsonCallers as $idx => $c) {
            if ($callerId > 0 && intval($c['id'] ?? 0) === $callerId) {
                $existingIdx = $idx;
                break;
            }
        }
        $updatedRecord = [
            'id' => $callerId > 0 ? $callerId : (count($jsonCallers) + 1),
            'callerCode' => $data['callerCode'] ?? ('CALLER-' . rand(100, 999)),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'territory' => $territory,
            'role' => $role,
            'password' => $passwordHash,
            'status' => $status,
            'active' => ($status === 'active'),
            'assignedLocations' => parse_territory_locations($territory),
            'createdAt' => time() * 1000
        ];
        if ($existingIdx >= 0) {
            $jsonCallers[$existingIdx] = array_merge($jsonCallers[$existingIdx], $updatedRecord);
        } else {
            $jsonCallers[] = $updatedRecord;
        }
        write_json_data('callers_store.json', $jsonCallers);

        echo json_encode(['success' => true, 'id' => $callerId, 'caller' => $updatedRecord]);
        exit;
    }

    // 2. DELETE
    if ($action === 'delete') {
        $callerId = intval($data['id'] ?? 0);
        if ($callerId <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing caller ID.']);
            exit;
        }

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $stmt = $pdo->prepare("DELETE FROM `callers` WHERE `id` = ?");
                $stmt->execute([$callerId]);
            }
        } catch (Exception $e) {
            error_log("[Callers API] Delete error: " . $e->getMessage());
        }

        $jsonCallers = read_json_data('callers_store.json');
        if (is_array($jsonCallers)) {
            $filtered = array_values(array_filter($jsonCallers, function($c) use ($callerId) {
                return intval($c['id'] ?? 0) !== $callerId;
            }));
            write_json_data('callers_store.json', $filtered);
        }

        echo json_encode(['success' => true, 'message' => 'Caller removed from database.']);
        exit;
    }

    // 3. UPDATE PASSWORD
    if ($action === 'update_password') {
        $callerId = intval($data['id'] ?? 0);
        $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $newHash = trim($data['passwordHash'] ?? ($data['password'] ?? ''));

        if (empty($newHash)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'New password hash required.']);
            exit;
        }

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                if ($callerId > 0) {
                    $stmt = $pdo->prepare("UPDATE `callers` SET `password_hash` = ?, `updated_at` = NOW() WHERE `id` = ?");
                    $stmt->execute([$newHash, $callerId]);
                } elseif (!empty($email)) {
                    $stmt = $pdo->prepare("UPDATE `callers` SET `password_hash` = ?, `updated_at` = NOW() WHERE `email` = ?");
                    $stmt->execute([$newHash, $email]);
                }
            }
        } catch (Exception $e) {
            error_log("[Callers API] Password update error: " . $e->getMessage());
        }

        $jsonCallers = read_json_data('callers_store.json');
        if (is_array($jsonCallers)) {
            foreach ($jsonCallers as &$c) {
                if (($callerId > 0 && intval($c['id'] ?? 0) === $callerId) || (!empty($email) && strtolower($c['email'] ?? '') === strtolower($email))) {
                    $c['password'] = $newHash;
                }
            }
            write_json_data('callers_store.json', $jsonCallers);
        }

        echo json_encode(['success' => true, 'message' => 'Caller password updated in database.']);
        exit;
    }
}
