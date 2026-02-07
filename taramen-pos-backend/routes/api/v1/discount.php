<?php

use App\Http\Controllers\product\DiscountController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('discounts', DiscountController::class);
    Route::get('discounts/getActive', [DiscountController::class, 'getAllActive']);
});
