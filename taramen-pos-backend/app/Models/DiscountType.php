<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountType extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name',
    ];


    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }


}
