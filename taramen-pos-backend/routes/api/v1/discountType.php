<?php

use App\Http\Controllers\product\DiscountController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Protected Routes
Route::middleware('auth:sanctum')->controller(DiscountController::class)->group(function () {
    Route::post('create/discount-types', 'createDiscountTypes');
    Route::post('update/discount-types', 'updateDiscountTypes');
    Route::post('get/discount-types', 'getDiscountTypes');
    Route::post('delete/discount-types', 'deleteDiscountTypes');
});
