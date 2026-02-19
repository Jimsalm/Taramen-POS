<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountType extends Model
{
    protected $fillable = [
        'name',
    ];


    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }


}
