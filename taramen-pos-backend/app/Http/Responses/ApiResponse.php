<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'OK',
        int $status = 200,
        array $meta = []
    ): JsonResponse {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        $systemDefaultMeta  = [
            "time" => now()->format('Y-m-d H:i:s'),
            "api_version" => "1.0.0",
            "request_id" => uniqid()
        ];

        $total_meta = array_merge($systemDefaultMeta, $meta);

        if (empty($meta)) {
            $payload['meta'] = $total_meta;
        }else{
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    public static function error(
        string $message = 'Error',
        int $status = 400,
        array $errors = [],
        array $meta = []
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        $systemDefaultMeta  = [
            "time" => now()->format('Y-m-d H:i:s'),
            "api_version" => "1.0.0",
            "request_id" => uniqid()
        ];

        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }

        $total_meta = array_merge($systemDefaultMeta, $meta);

        if (empty($meta)) {
            $payload['meta'] = $total_meta;
        }else{
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }
}
