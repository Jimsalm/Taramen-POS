<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\product\OrderController;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('orders/stats', [OrderController::class, 'stats']);

    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::apiResource('orders', OrderController::class);
});
