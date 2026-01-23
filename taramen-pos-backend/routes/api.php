<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Version 1
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    require __DIR__ . '/api/v1/auth.php';
    require __DIR__ . '/api/v1/category.php';
    require __DIR__ . '/api/v1/menu_item.php';
    require __DIR__ . '/api/v1/employee.php';
    require __DIR__ . '/api/v1/discount.php';
    require __DIR__ . '/api/v1/order.php';
});
