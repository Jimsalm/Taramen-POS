<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function discount() : BelongsToMany {
        return $this->belongsToMany(MenuItem::class, );
    }

}
