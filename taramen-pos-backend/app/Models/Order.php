<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'employee_id',
        'table_number',
        'status',
        'subtotal',
        'total_discount',
        'total_amount',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateOrderNumber()
    {
        $prefix = 'ORD-';
        $latestOrder = self::latest()->first();
        $nextNumber = $latestOrder ? (int) substr($latestOrder->order_number, 3) + 1 : 1;
        return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    public function calculateTotalAmount()
    {
        $this->subtotal = $this->orderItems()->sum('subtotal');
        $this->total_discount = $this->orderItems()->sum('total_discount');
        $this->total_amount = $this->orderItems()->sum('total_amount');
    }
}
