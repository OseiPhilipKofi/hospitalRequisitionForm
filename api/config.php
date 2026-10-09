<?php

declare(strict_types=1);

return [
    'driver' => 'sqlite',
    'sqlite_path' => __DIR__ . '/storage/hospital.sqlite',
    'mysql' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'database' => 'hospital_requisition',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    'jwt_secret' => 'change-this-emergency-unit-jwt-secret-in-production',
    'jwt_ttl' => 86400,
    'cors_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
];
