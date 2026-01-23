<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\OrderController;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('orders/stats', [OrderController::class, 'stats']);

    Route::apiResource('orders', OrderController::class);
});
