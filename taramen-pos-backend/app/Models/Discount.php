<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = [
        'name',
        'type',
        'value',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'value' => 'decimal:2'
    ];


}
