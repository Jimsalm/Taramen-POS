<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuItem extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'price',
        'category_id',
        'available',
        'image',
    ];

    protected $casts = [
        'available' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function discount(): BelongsToMany
    {
        return $this->belongsToMany(Discount::class, 'discount_items');
    }
}
