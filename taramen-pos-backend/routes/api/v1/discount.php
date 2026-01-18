<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Product\Controllers\DiscountController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('discounts', DiscountController::class);
    Route::get('discounts/getActive', [DiscountController::class, 'getAllActive']);
});
