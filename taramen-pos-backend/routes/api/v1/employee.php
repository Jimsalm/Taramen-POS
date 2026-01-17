<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\EmployeeController;

Route::middleware(['auth:sanctum'])->group(function (){

    Route::patch('employees/{id}/toggle-status', [EmployeeController::class, 'toggleStatus']);
    Route::get('employees/all', [EmployeeController::class, 'getAllEmployees']);

    Route::apiResource('employees', EmployeeController::class);
});