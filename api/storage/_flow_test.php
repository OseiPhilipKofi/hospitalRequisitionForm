<?php

function req($method, $path, $body = null, $token = null)
{
    $ch = curl_init('http://127.0.0.1:8080' . $path);
    $headers = ['Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $body ? json_encode($body) : null,
    ]);
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = json_decode($raw, true);
    echo "$method $path => $code\n";
    echo $raw . "\n\n";
    return [$code, $data];
}

[, $unit] = req('POST', '/auth/login', ['email' => 'unit@hospital.local', 'password' => 'Unit@12345']);
[, $admin] = req('POST', '/auth/login', ['email' => 'admin@hospital.local', 'password' => 'Admin@12345']);
[, $store] = req('POST', '/auth/login', ['email' => 'store@hospital.local', 'password' => 'Store@12345']);

req('GET', '/inventory', null, $unit['token']);
[, $created] = req('POST', '/requisitions', ['item_id' => 1, 'quantity' => 2], $unit['token']);
req('POST', '/requisitions', ['item_id' => 1, 'quantity' => 2], $store['token']);
req('GET', '/users', null, $unit['token']);
req('GET', '/requisitions', null, $admin['token']);
req('PATCH', '/requisitions/' . $created['requisition']['id'], ['status' => 'Approved', 'admin_notes' => 'Issued to Emergency'], $admin['token']);
req('GET', '/requisitions', null, $store['token']);
req('GET', '/requisitions', null, $unit['token']);
req('POST', '/auth/register', ['username' => 'new.nurse', 'email' => 'nurse@hospital.local', 'password' => 'Nurse@12345']);
req('GET', '/users', null, $admin['token']);
