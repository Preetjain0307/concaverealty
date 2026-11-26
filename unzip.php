<?php
/**
 * Concave Realty - Automated Hostinger ZIP Extractor
 * Bypasses Hostinger Web File Manager 30s timeout and memory limits.
 * Access via: https://concaverealty.com/unzip.php
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
@ini_set('memory_limit', '1024M');
@set_time_limit(600);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Concave Realty - Server Extractor</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0c1a17; color: #e8f0ed; margin: 0; padding: 40px 20px; }
        .card { max-width: 680px; margin: 0 auto; background: #132722; border-radius: 16px; padding: 32px; border: 1px solid #1f3f37; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        h1 { color: #d4af37; margin-top: 0; font-size: 24px; border-bottom: 1px solid #1f3f37; padding-bottom: 16px; }
        .btn { display: inline-block; background: #d4af37; color: #0c1a17; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; border: none; cursor: pointer; font-size: 15px; margin-top: 10px; }
        .btn:hover { background: #e5c158; }
        .btn-secondary { background: #244b41; color: #e8f0ed; margin-left: 10px; }
        .log-box { background: #070e0c; border: 1px solid #1f3f37; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; max-height: 280px; overflow-y: auto; color: #7fe3c5; margin: 20px 0; }
        .success { color: #4ade80; font-weight: bold; font-size: 18px; }
        .error { color: #f87171; font-weight: bold; }
        .stat { color: #cbd5e1; margin: 6px 0; }
    </style>
</head>
<body>

<div class="card">
    <h1>Concave Realty &bull; Auto-Extractor</h1>

<?php
$candidateZips = ['hostinger_code_update.zip', 'hostinger_deploy.zip'];
$foundZips = [];

foreach ($candidateZips as $f) {
    $fullPath = __DIR__ . '/' . $f;
    if (file_exists($fullPath)) {
        $foundZips[] = [
            'name' => $f,
            'path' => $fullPath,
            'mtime' => filemtime($fullPath),
            'size' => filesize($fullPath)
        ];
    }
}

// Sort by newest modified time descending so the latest uploaded file is always extracted first
usort($foundZips, function($a, $b) {
    return $b['mtime'] - $a['mtime'];
});

if (isset($_GET['file'])) {
    $requested = basename($_GET['file']);
    foreach ($foundZips as $fz) {
        if ($fz['name'] === $requested) {
            $selectedZip = $fz;
            break;
        }
    }
}

if (!isset($selectedZip) && !empty($foundZips)) {
    $selectedZip = $foundZips[0];
}

if (empty($foundZips)) {
    echo "<p class='error'>No zip file found in public_html!</p>";
    echo "<p>Please ensure <code>hostinger_code_update.zip</code> or <code>hostinger_deploy.zip</code> is uploaded to <code>public_html</code>.</p>";
    echo "</div></body></html>";
    exit;
}

$zipPath = $selectedZip['path'];
$targetZip = $selectedZip['name'];
$fileSizeMB = round($selectedZip['size'] / (1024 * 1024), 2);
$fileDate = date("Y-m-d H:i:s", $selectedZip['mtime']);

echo "<p class='stat'>Extracting Target: <strong style='color:#4ade80;'>{$targetZip}</strong> ({$fileSizeMB} MB &bull; Uploaded: {$fileDate})</p>";
if (count($foundZips) > 1) {
    echo "<p class='stat' style='font-size:12px; color:#94a3b8;'>Detected " . count($foundZips) . " archives. Automatically selected newest. Other archives: ";
    foreach ($foundZips as $fz) {
        if ($fz['name'] !== $targetZip) {
            echo "<a style='color:#d4af37;' href='unzip.php?file=" . urlencode($fz['name']) . "'>" . htmlspecialchars($fz['name']) . "</a> ";
        }
    }
    echo "</p>";
}

if (!class_exists('ZipArchive')) {
    echo "<p class='error'>Error: PHP ZipArchive extension is not enabled on this server.</p>";
    echo "</div></body></html>";
    exit;
}

$zip = new ZipArchive();
$res = $zip->open($zipPath);

if ($res === TRUE) {
    $numFiles = $zip->numFiles;
    echo "<p class='stat'>Total Items in Archive: <strong>{$numFiles} files & folders</strong></p>";
    echo "<div class='log-box'>";
    
    $extractedCount = 0;
    for ($i = 0; $i < $numFiles; $i++) {
        $entryName = $zip->getNameIndex($i);
        $zip->extractTo(__DIR__, [$entryName]);
        $extractedCount++;
        if ($extractedCount <= 15 || $extractedCount % 50 === 0 || $extractedCount === $numFiles) {
            echo "Extracted: " . htmlspecialchars($entryName) . "<br>";
            flush();
        }
    }
    
    $zip->close();
    echo "</div>";
    
    echo "<p class='success'>&check; Extraction Successfully Completed!</p>";
    echo "<p>All files, assets, API endpoints, and configurations are now live in <code>public_html</code>.</p>";
    
    echo "<div style='margin-top: 24px;'>";
    echo "<a href='/' class='btn' target='_blank'>&rarr; View Live Website</a>";
    echo "<a href='/concave_caller' class='btn btn-secondary' target='_blank'>&rarr; Open Caller Portal</a>";
    echo "</div>";
    
    echo "<p style='margin-top: 24px; font-size: 13px; color: #94a3b8;'>Security Note: After confirming your site works, you can delete <code>unzip.php</code> from Hostinger File Manager.</p>";
} else {
    echo "<p class='error'>Failed to open {$targetZip}. Error code: {$res}</p>";
}
?>

</div>
</body>
</html>
