<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EndpointLog extends Model
{
    protected $fillable = [
        'method',
        'endpoint',
        'path',
        'status_code',
        'is_success',
        'ip_address',
        'user_id',
        'user_agent',
        'duration_ms',
        'error_message',
    ];

    protected $casts = [
        'is_success' => 'boolean',
        'duration_ms' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
