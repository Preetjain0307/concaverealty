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
$phone = isset($data['phone']) ? preg_replace('/\D/', '', $data['phone']) : (isset($data['mobile']) ? preg_replace('/\D/', '', $data['mobile']) : '');
$jobId = isset($data['jobId']) ? strip_tags(trim($data['jobId'])) : 'GENERAL';
$jobTitle = isset($data['jobTitle']) ? strip_tags(trim($data['jobTitle'])) : (isset($data['position']) ? strip_tags(trim($data['position'])) : 'General Application');
$experience = isset($data['experience']) ? strip_tags(trim($data['experience'])) : '';
$portfolioLink = isset($data['portfolioLink']) ? filter_var(trim($data['portfolioLink']), FILTER_SANITIZE_URL) : (isset($data['linkedin']) ? filter_var(trim($data['linkedin']), FILTER_SANITIZE_URL) : '');
$city = isset($data['city']) ? strip_tags(trim($data['city'])) : 'Mumbai';
$currentCompany = isset($data['currentCompany']) ? strip_tags(trim($data['currentCompany'])) : 'Not Disclosed';
$currentRole = isset($data['currentRole']) ? strip_tags(trim($data['currentRole'])) : 'N/A';
$currentCtc = isset($data['currentCtc']) ? strip_tags(trim($data['currentCtc'])) : 'Not Disclosed';
$expectedCtc = isset($data['expectedCtc']) ? strip_tags(trim($data['expectedCtc'])) : 'Negotiable';
$noticePeriod = isset($data['noticePeriod']) ? strip_tags(trim($data['noticePeriod'])) : 'Immediate';
$coverNote = isset($data['coverNote']) ? strip_tags(trim($data['coverNote'])) : '';

$resumeName = isset($data['resumeName']) ? preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $data['resumeName']) : 'Resume.pdf';
$resumeData = isset($data['resumeData']) ? $data['resumeData'] : '';
$resumePath = '';

// Handle resume file saving to disk (uploads/resumes/) if provided as base64
if (!empty($resumeData) && strpos($resumeData, 'data:') === 0) {
    try {
        $uploadDir = __DIR__ . '/../uploads/resumes';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        $ext = strtolower(pathinfo($resumeName, PATHINFO_EXTENSION) ?: 'pdf');
        if (!in_array($ext, ['pdf', 'doc', 'docx'])) {
            $ext = 'pdf';
        }
        $safeFilename = 'resume_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $ext;
        $targetPath = $uploadDir . '/' . $safeFilename;
        $parts = explode(',', $resumeData);
        if (count($parts) === 2) {
            $decoded = base64_decode($parts[1]);
            if ($decoded !== false && strlen($decoded) <= 2.5 * 1024 * 1024) {
                if (@file_put_contents($targetPath, $decoded) !== false) {
                    $resumePath = '/uploads/resumes/' . $safeFilename;
                }
            }
        }
    } catch (\Throwable $fileErr) {
        error_log("[Career Apply] File save notice: " . $fileErr->getMessage());
    }
}

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

// 3. Deduplication Check: Prevent 2 applications when client submitted once within 60s
$duplicatePrevented = false;
try {
    $pdo = get_db_connection();
    if ($pdo) {
        $checkStmt = $pdo->prepare("SELECT id FROM `job_applications` WHERE (`email` = ? OR `phone` = ?) AND `created_at` >= (NOW() - INTERVAL 60 SECOND) ORDER BY id DESC LIMIT 1");
        $checkStmt->execute([strtolower($email), $phone]);
        $existingApp = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingApp) {
            $updateStmt = $pdo->prepare("
                UPDATE `job_applications`
                SET `job_id` = ?, `job_title` = ?, `applicant_name` = ?, `experience` = ?, `portfolio_link` = ?,
                    `resume_name` = ?, `resume_path` = ?, `resume_data` = ?, `city` = ?, `current_company` = ?,
                    `current_role` = ?, `current_ctc` = ?, `expected_ctc` = ?, `notice_period` = ?, `cover_note` = ?
                WHERE `id` = ?
            ");
            $updateStmt->execute([
                $jobId, $jobTitle, $name, $experience, $portfolioLink,
                $resumeName, $resumePath, $resumeData, $city, $currentCompany,
                $currentRole, $currentCtc, $expectedCtc, $noticePeriod, $coverNote,
                $existingApp['id']
            ]);
            $duplicatePrevented = true;
        }
    }
} catch (\Throwable $dupErr) {
    error_log("[Career Apply] Dedup check notice: " . $dupErr->getMessage());
}

// 4. Insert into MySQL via SafeDB if not already updated by dedup check
if (!$duplicatePrevented) {
    try {
        SafeDB::insert('job_applications', [
            'job_id' => $jobId,
            'job_title' => $jobTitle,
            'applicant_name' => $name,
            'email' => strtolower($email),
            'phone' => $phone,
            'experience' => $experience,
            'portfolio_link' => $portfolioLink,
            'resume_name' => $resumeName,
            'resume_path' => $resumePath,
            'resume_data' => $resumeData,
            'city' => $city,
            'current_company' => $currentCompany,
            'current_role' => $currentRole,
            'current_ctc' => $currentCtc,
            'expected_ctc' => $expectedCtc,
            'notice_period' => $noticePeriod,
            'cover_note' => $coverNote,
            'status' => 'Under Review',
            'verified_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ]);
    } catch (\Throwable $e) {
        error_log("[Career Apply] SafeDB insert notice: " . $e->getMessage());
    }
}

// 5. Resilient backup in data/careers_store.json
try {
    $apps = read_json_data('careers_store.json');
    if (!is_array($apps)) $apps = [];
    
    // Deduplicate in JSON store as well
    $recentExists = false;
    foreach ($apps as &$exApp) {
        if (($exApp['email'] === strtolower($email) || $exApp['phone'] === $phone) && (time() * 1000 - ($exApp['createdAt'] ?? 0)) < 60000) {
            $exApp['jobId'] = $jobId;
            $exApp['jobTitle'] = $jobTitle;
            $exApp['name'] = $name;
            $exApp['applicantName'] = $name;
            $exApp['resumeName'] = $resumeName;
            $exApp['resumePath'] = $resumePath;
            $exApp['resumeData'] = $resumeData;
            $recentExists = true;
            break;
        }
    }
    
    if (!$recentExists) {
        array_unshift($apps, [
            'id' => time(),
            'jobId' => $jobId,
            'jobTitle' => $jobTitle,
            'position' => $jobTitle,
            'applicantName' => $name,
            'name' => $name,
            'email' => strtolower($email),
            'phone' => $phone,
            'mobile' => $phone,
            'city' => $city,
            'experience' => $experience,
            'portfolioLink' => $portfolioLink,
            'currentCompany' => $currentCompany,
            'currentRole' => $currentRole,
            'currentCtc' => $currentCtc,
            'expectedCtc' => $expectedCtc,
            'noticePeriod' => $noticePeriod,
            'coverNote' => $coverNote,
            'resumeName' => $resumeName,
            'resumePath' => $resumePath,
            'resumeData' => $resumeData,
            'status' => 'Under Review',
            'createdAt' => time() * 1000,
            'appliedAt' => time() * 1000
        ]);
    }
    if (count($apps) > 500) {
        $apps = array_slice($apps, 0, 500);
    }
    write_json_data('careers_store.json', $apps);
} catch (\Throwable $e) {
    error_log("[Career Apply] JSON store backup notice: " . $e->getMessage());
}

// 4. Return Confirmed Application Acceptance
http_response_code(200);
echo json_encode([
    'success' => true,
    'verified' => true,
    'message' => 'Email verification confirmed on server. Application accepted.'
]);
exit;
