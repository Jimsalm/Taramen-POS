<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Strict rate limiting for sensitive endpoints (e.g., auth, admin)
        RateLimiter::for('limit_strict', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Moderate rate limiting for order-related endpoints
        RateLimiter::for('limit_orders', function (Request $request) {
            return Limit::perMinute(20)->by($request->ip());
        });

        // General rate limiting for other endpoints
        RateLimiter::for('limit_general', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
