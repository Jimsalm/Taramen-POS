<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\CategoryController;

Route::middleware(['auth:sanctum'])->group(function () {
 
    Route::apiResource('categories', CategoryController::class);
});