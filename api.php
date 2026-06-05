<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$url = 'https://script.google.com/macros/s/AKfycbz4kjDksLCFPBHwjBdqKOezYPCTn6vN6Uvf29KLXcevlXIdER1otTN8-8goxbrCQKd5OQ/exec';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');

$response = curl_exec($ch);
$error    = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => $error]);
} else {
    echo $response;
}
