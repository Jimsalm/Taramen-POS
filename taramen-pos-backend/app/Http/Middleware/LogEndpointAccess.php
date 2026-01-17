<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class LogEndpointAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        try {
            $response = $next($request);
        } catch (\Throwable $e) {
            $this->logRequest($request, 500, microtime(true) - $startTime);
            throw $e;
        }
        
        $duration = microtime(true) - $startTime;
        
        $this->logRequest($request, $response->getStatusCode(), $duration);
        
        return $response;
    }
    
    private function logRequest(Request $request, int $statusCode, float $duration): void
    {
        $isSuccessful = $statusCode >= 200 && $statusCode < 400;
        
        $logData = [
            'timestamp' => now()->toDateTimeString(),
            'method' => $request->method(),
            'endpoint' => $request->fullUrl(),
            'path' => $request->path(),
            'status_code' => $statusCode,
            'ip_address' => $request->ip(),
            'user_id' => auth()->id(),
            'user_agent' => $request->userAgent(),
            'duration' => round($duration * 1000, 2) . 'ms',
        ];
        
        if ($isSuccessful) {
            Log::channel('endpoint_success')->info('Successful endpoint access', $logData);
        } else {
            Log::channel('endpoint_failure')->warning('Failed endpoint access', $logData);
        }
    }
}
