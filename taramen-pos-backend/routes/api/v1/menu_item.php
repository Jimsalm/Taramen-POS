<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\MenuItemController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('menu-items/{id}/restore', [MenuItemController::class, 'restore'])->name('menu-items.restore');
    Route::patch('menu-items/{id}/toggle-availability', [MenuItemController::class, 'toggleAvailability']);
    Route::get('menu-items/available', [MenuItemController::class, 'available']);

    Route::apiResource('menu-items', MenuItemController::class);
});