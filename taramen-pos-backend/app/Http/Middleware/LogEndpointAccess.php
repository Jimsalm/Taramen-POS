<?php

namespace App\Http\Middleware;

use App\Models\EndpointLog;
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
            $this->logRequest($request, 500, microtime(true) - $startTime, $e->getMessage());
            throw $e;
        }
        
        $duration = microtime(true) - $startTime;
        
        $this->logRequest($request, $response->getStatusCode(), $duration);
        
        return $response;
    }
    
    private function logRequest(Request $request, int $statusCode, float $duration, ?string $errorMessage = null): void
    {
        $isSuccessful = $statusCode >= 200 && $statusCode < 400;
        $durationMs = round($duration * 1000, 2);
        
        $logData = [
            'timestamp' => now()->toDateTimeString(),
            'method' => $request->method(),
            'endpoint' => $request->fullUrl(),
            'path' => $request->path(),
            'status_code' => $statusCode,
            'ip_address' => $request->ip(),
            'user_id' => auth()->id(),
            'user_agent' => $request->userAgent(),
            'duration' => $durationMs . 'ms',
            'duration_ms' => $durationMs,
            'error_message' => $errorMessage,
        ];
        
        if ($isSuccessful) {
            Log::channel('endpoint_success')->info('Successful endpoint access', $logData);
        } else {
            Log::channel('endpoint_failure')->warning('Failed endpoint access', $logData);
        }

        $this->storeDatabaseLog($logData, $isSuccessful);
    }

    private function storeDatabaseLog(array $logData, bool $isSuccessful): void
    {
        try {
            EndpointLog::create([
                'method' => $logData['method'],
                'endpoint' => $logData['endpoint'],
                'path' => $logData['path'],
                'status_code' => $logData['status_code'],
                'is_success' => $isSuccessful,
                'ip_address' => $logData['ip_address'],
                'user_id' => $logData['user_id'],
                'user_agent' => $logData['user_agent'],
                'duration_ms' => $logData['duration_ms'],
                'error_message' => $logData['error_message'],
            ]);
        } catch (\Throwable $e) {
            Log::channel('endpoint_failure')->warning(
                'Failed to save endpoint log to database',
                [
                    'method' => $logData['method'],
                    'endpoint' => $logData['endpoint'],
                    'status_code' => $logData['status_code'],
                    'reason' => $e->getMessage(),
                ]
            );
        }
    }
}
