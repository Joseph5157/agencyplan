<?php

return [
    'disk' => env('UPLOAD_DISK', 'public'),
    'max_size_kb' => (int) env('UPLOAD_MAX_SIZE_KB', 10240),
];

