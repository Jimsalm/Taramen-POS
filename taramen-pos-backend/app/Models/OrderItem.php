<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'item_name',
        'unit_price',
        'quantity',
        'subtotal',
        'discount_id',
        'discount_name',
        'discount_type',
        'discount_amount',
        'total_amount',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function calculateTotalAmount()
    {
        $this->subtotal = $this->unit_price * $this->quantity;
        $this->discount_amount = $this->calculateDiscount();
        $this->total_amount = $this->subtotal - $this->discount_amount;
    }

    public function calculateDiscount()
    {
        if ($this->discount_type === 'percentage') {
            return $this->subtotal * ($this->discount_amount / 100);
        } elseif ($this->discount_type === 'fixed') {
            return $this->discount_amount;
        } elseif ($this->discount_type === 'buy1take1') {
            return $this->subtotal * ($this->discount_amount / 100);
        }
        return 0;
    }
}
