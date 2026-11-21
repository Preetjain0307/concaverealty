<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '1024M');
set_time_limit(600);

echo "<h2>Concave Realty - Hostinger Auto-Extractor</h2>";
$zipFile = __DIR__ . '/hostinger_deploy.zip';

if (!file_exists($zipFile)) {
    die("<p style='color:red;'>Error: hostinger_deploy.zip not found in public_html</p>");
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);
if ($res === TRUE) {
    echo "<p>Found archive (" . round(filesize($zipFile) / (1024*1024), 2) . " MB). Extracting all files...</p>";
    $zip->extractTo(__DIR__);
    $zip->close();
    echo "<p style='color:green; font-weight:bold; font-size:18px;'>Extraction Complete! All files, assets, and backend are live.</p>";
    echo "<p><a href='/'>Click here to view your live website</a></p>";
} else {
    echo "<p style='color:red;'>Failed to open zip archive. Code: " . $res . "</p>";
}
?>