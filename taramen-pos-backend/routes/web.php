<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'taramen-pos-backend',
        'timestamp' => now()->toIso8601String(),
    ], 200);
});
