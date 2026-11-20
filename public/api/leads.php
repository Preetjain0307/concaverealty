<?php
/**
 * Concave Realty - /api/leads
 * Shared Hosting PHP Endpoint for Live Real-Time Leads Synchronization
 * Stores customer website enquiries directly into Hostinger MySQL with atomic JSON fallback.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// Location code mappings (1-8)
$locationMap = [
    1 => 'Borivali',
    2 => 'Kandivali',
    3 => 'Goregaon',
    4 => 'Malad',
    5 => 'Jogeshwari',
    6 => 'Andheri',
    7 => 'Bandra',
    8 => 'Lower Parel'
];

$reverseLocationMap = [
    'borivali' => 1,
    'kandivali' => 2,
    'goregaon' => 3,
    'malad' => 4,
    'jogeshwari' => 5,
    'andheri' => 6,
    'bandra' => 7,
    'lower parel' => 8
];

// Helper: Read server leads
function get_server_leads() {
    global $reverseLocationMap;
    $dbLeads = [];

    // Attempt 1: Fetch from MySQL database
    try {
        $pdo = get_db_connection();
        if ($pdo) {
            $stmt = $pdo->query("SELECT * FROM `leads` ORDER BY `id` DESC");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            if (!empty($rows)) {
                foreach ($rows as $row) {
                    $notes = [];
                    if (!empty($row['notes'])) {
                        $decoded = json_decode($row['notes'], true);
                        if (is_array($decoded)) {
                            $notes = $decoded;
                        }
                    }

                    $locLower = strtolower(trim($row['preferred_location'] ?? ''));
                    $locId = isset($reverseLocationMap[$locLower]) ? $reverseLocationMap[$locLower] : 1;
                    $callerId = ($row['assigned_caller_code'] === 'Callerproxy') ? 2 : 1;

                    $dbLeads[] = [
                        'i' => intval($row['id']),
                        'n' => $row['name'],
                        'm' => $row['phone'],
                        'e' => $row['email'] ?? '',
                        'l' => $locId,
                        'p' => 1,
                        'pr' => $row['property_type'] ?? 'Luxury Apartment',
                        't' => 1,
                        's' => ($row['status'] === 'New') ? 7 : 2,
                        'c' => $callerId,
                        'cs' => 0,
                        'rc' => 0,
                        'na' => null,
                        'ts' => !empty($row['created_at']) ? strtotime($row['created_at']) * 1000 : time() * 1000,
                        'd' => $row['property_type'] ?? 'Website Consultation Request',
                        'dv' => 'Mobile / Web',
                        'nt' => $notes
                    ];
                }
            }
        }
    } catch (Exception $e) {
        error_log("[Leads API] MySQL fetch error: " . $e->getMessage());
    }

    // Attempt 2: If MySQL is empty or offline, check data/leads_store.json
    $jsonStore = read_json_data('leads_store.json');
    if (!empty($jsonStore) && is_array($jsonStore)) {
        // Merge without duplicates (by phone + timestamp or ID)
        $existingIds = array_column($dbLeads, 'i');
        foreach ($jsonStore as $jl) {
            if (!in_array($jl['i'] ?? null, $existingIds)) {
                $dbLeads[] = $jl;
            }
        }
    }

    return $dbLeads;
}

// -----------------------------------------------------------------------------
// 1. GET: Return all synchronized leads
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $leads = get_server_leads();
    echo json_encode([
        'success' => true,
        'count' => count($leads),
        'leads' => $leads,
        'timestamp' => time()
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// 2. POST: Create a new website customer enquiry
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
        exit;
    }

    // Action: Update existing lead
    $action = isset($_GET['action']) ? $_GET['action'] : ($data['action'] ?? 'create');
    if ($action === 'update') {
        $leadId = intval($data['id'] ?? 0);
        if ($leadId <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing lead ID.']);
            exit;
        }

        // Update in MySQL
        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $statusStr = isset($data['statusName']) ? strip_tags($data['statusName']) : 'Updated';
                $notesJson = isset($data['notes']) ? json_encode($data['notes']) : null;
                $stmt = $pdo->prepare("UPDATE `leads` SET `status` = ?, `notes` = ?, `updated_at` = NOW() WHERE `id` = ?");
                $stmt->execute([$statusStr, $notesJson, $leadId]);
            }
        } catch (Exception $e) {
            error_log("[Leads API] Update error: " . $e->getMessage());
        }

        echo json_encode(['success' => true, 'message' => 'Lead updated successfully.']);
        exit;
    }

    // Honeypot Bot Trap Check
    if (!empty($data['honeypot'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Automated submission blocked.']);
        exit;
    }

    // Input sanitization
    $name = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
    $phone = isset($data['mobile']) ? preg_replace('/\D/', '', $data['mobile']) : (isset($data['phone']) ? preg_replace('/\D/', '', $data['phone']) : '');
    $email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
    $locationName = isset($data['locationName']) ? strip_tags(trim($data['locationName'])) : 'Borivali';
    $projectName = isset($data['projectName']) ? strip_tags(trim($data['projectName'])) : 'Concave Prime';
    $type = isset($data['type']) ? strip_tags(trim($data['type'])) : 'General Enquiry';
    $description = isset($data['description']) ? strip_tags(trim($data['description'])) : '';
    $deviceName = isset($data['deviceName']) ? strip_tags(trim($data['deviceName'])) : 'Web / Mobile';

    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide a valid full name.']);
        exit;
    }

    if (empty($phone) || strlen($phone) < 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please enter a valid 10-digit mobile number.']);
        exit;
    }

    // Territory Auto-assignment:
    // Borivali, Kandivali, Goregaon, Malad -> Preet Jain (Callerpreet)
    // Jogeshwari, Andheri, Bandra, Lower Parel -> Callerproxy
    $locLower = strtolower($locationName);
    $locId = isset($reverseLocationMap[$locLower]) ? $reverseLocationMap[$locLower] : 1;
    $assignedCallerCode = in_array($locId, [5, 6, 7, 8]) ? 'Callerproxy' : 'Callerpreet';
    $callerId = in_array($locId, [5, 6, 7, 8]) ? 2 : 1;

    $insertedId = 0;

    // 1. Insert into Hostinger MySQL
    try {
        $pdo = get_db_connection();
        if ($pdo) {
            $stmt = $pdo->prepare("
                INSERT INTO `leads` (`name`, `phone`, `email`, `preferred_location`, `property_type`, `budget`, `source`, `status`, `assigned_caller_code`, `notes`, `created_at`)
                VALUES (?, ?, ?, ?, ?, ?, 'Website', 'New', ?, ?, NOW())
            ");
            $descText = !empty($description) ? $description : "Interested in {$projectName} ({$locationName}).";
            $emptyNotesJson = json_encode([]);
            $stmt->execute([
                $name,
                $phone,
                $email,
                $locationName,
                $projectName,
                $type,
                $assignedCallerCode,
                $emptyNotesJson
            ]);
            $insertedId = intval($pdo->lastInsertId());
        }
    } catch (Exception $e) {
        error_log("[Leads API] MySQL insert error: " . $e->getMessage());
    }

    // If MySQL is not reachable or auto-increment not returned, generate timestamp id
    if ($insertedId <= 0) {
        $insertedId = time();
    }

    // Build standard compact lead object
    $compactLead = [
        'i' => $insertedId,
        'n' => $name,
        'm' => $phone,
        'e' => $email,
        'l' => $locId,
        'p' => 1,
        'pr' => $projectName,
        't' => 1,
        's' => 7, // New
        'c' => $callerId,
        'cs' => 0, // Uncalled
        'rc' => 0,
        'na' => null,
        'ts' => time() * 1000,
        'd' => !empty($description) ? $description : "Website enquiry for {$projectName} ({$locationName})",
        'dv' => $deviceName,
        'nt' => []
    ];

    // 2. Secondary backup in data/leads_store.json
    $jsonStore = read_json_data('leads_store.json');
    if (!is_array($jsonStore)) $jsonStore = [];
    array_unshift($jsonStore, $compactLead);
    // Keep max 1000 records in JSON fallback
    if (count($jsonStore) > 1000) {
        $jsonStore = array_slice($jsonStore, 0, 1000);
    }
    write_json_data('leads_store.json', $jsonStore);

    echo json_encode([
        'success' => true,
        'message' => 'Enquiry successfully registered and assigned.',
        'lead' => $compactLead
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
