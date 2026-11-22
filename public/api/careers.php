<?php
/**
 * Concave Realty - /api/careers
 * Live Real-Time MySQL Job Applications Management API.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// GET: Fetch all job applications from MySQL
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $apps = [];

    try {
        $pdo = get_db_connection();
        if ($pdo) {
            $stmt = $pdo->query("SELECT * FROM `job_applications` ORDER BY `id` DESC");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            foreach ($rows as $row) {
                $apps[] = [
                    'id' => intval($row['id']),
                    'jobId' => $row['job_id'],
                    'jobTitle' => $row['job_title'],
                    'applicantName' => $row['applicant_name'],
                    'name' => $row['applicant_name'],
                    'email' => $row['email'],
                    'phone' => $row['phone'],
                    'experience' => $row['experience'] ?? '',
                    'portfolioLink' => $row['portfolio_link'] ?? '',
                    'status' => $row['status'] ?? 'Pending Review',
                    'verifiedAt' => $row['verified_at'],
                    'createdAt' => !empty($row['created_at']) ? strtotime($row['created_at']) * 1000 : time() * 1000
                ];
            }
        }
    } catch (Exception $e) {
        error_log("[Careers API] Fetch error: " . $e->getMessage());
    }

    // JSON fallback
    if (empty($apps)) {
        $jsonApps = read_json_data('careers_store.json');
        if (!empty($jsonApps) && is_array($jsonApps)) {
            $apps = $jsonApps;
        }
    }

    echo json_encode(['success' => true, 'count' => count($apps), 'applications' => $apps]);
    exit;
}

// -----------------------------------------------------------------------------
// POST: Update status or Delete application
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
        exit;
    }

    $action = isset($_GET['action']) ? $_GET['action'] : ($data['action'] ?? 'update_status');

    if ($action === 'create') {
        $jobId = strip_tags(trim($data['jobId'] ?? 'GENERAL'));
        $jobTitle = strip_tags(trim($data['jobTitle'] ?? 'General Application'));
        $name = strip_tags(trim($data['name'] ?? $data['applicantName'] ?? ''));
        $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone = preg_replace('/\D/', '', $data['phone'] ?? $data['mobile'] ?? '');
        $experience = strip_tags(trim($data['experience'] ?? ''));
        $portfolioLink = filter_var(trim($data['portfolioLink'] ?? ''), FILTER_SANITIZE_URL);

        if (!empty($name) && !empty($email)) {
            try {
                $pdo = get_db_connection();
                if ($pdo) {
                    $stmt = $pdo->prepare("
                        INSERT INTO `job_applications` (`job_id`, `job_title`, `applicant_name`, `email`, `phone`, `experience`, `portfolio_link`, `status`, `verified_at`, `created_at`)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'Under Review', NOW(), NOW())
                    ");
                    $stmt->execute([$jobId, $jobTitle, $name, $email, $phone, $experience, $portfolioLink]);
                }
            } catch (\Throwable $e) {
                error_log("[Careers API] Create error: " . $e->getMessage());
            }
        }

        echo json_encode(['success' => true, 'message' => 'Job application recorded in database.']);
        exit;
    }

    if ($action === 'update_status') {
        $appId = intval($data['id'] ?? 0);
        $newStatus = strip_tags(trim($data['status'] ?? 'Reviewed'));

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $stmt = $pdo->prepare("UPDATE `job_applications` SET `status` = ? WHERE `id` = ?");
                $stmt->execute([$newStatus, $appId]);
            }
        } catch (Exception $e) {
            error_log("[Careers API] Update error: " . $e->getMessage());
        }

        echo json_encode(['success' => true, 'message' => 'Application status updated in database.']);
        exit;
    }

    if ($action === 'delete') {
        $appId = intval($data['id'] ?? 0);

        try {
            $pdo = get_db_connection();
            if ($pdo) {
                $stmt = $pdo->prepare("DELETE FROM `job_applications` WHERE `id` = ?");
                $stmt->execute([$appId]);
            }
        } catch (Exception $e) {
            error_log("[Careers API] Delete error: " . $e->getMessage());
        }

        echo json_encode(['success' => true, 'message' => 'Application removed from database.']);
        exit;
    }
}
