<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout', 
        'register',
        'user',
        'index',
        'store',
        'all',
        'changerhoraires',
        'filieres',
        'alerts*',
        'avancements*',
        'totalNbrFilieres',
        'nbrgroupes',
        'nbralerts',
        'calendrierefms*',
        'etatsmodules',
        'uploadstats',
        'notifications',
        'checkProgress',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',   'http://192.168.1.70:3000', 'http://10.152.67.91:3000'
     
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];