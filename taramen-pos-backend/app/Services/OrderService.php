<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\Discount;
use Illuminate\Support\Facades\DB;

class OrderService{
    
    public function getAllOrders(){
        return Order::with('orderItems', 'employee')->latest()->get();
    }

    public function getFilteredOrders($filters = [], $perPage = 10){
        $query = Order::with('orderItems', 'employee');

        if(isset($filters['status'])){
            $query->where('status', $filters['status']);
        }

        if(isset($filters['employee_id'])){
            $query->where('employee_id', $filters['employee_id']);
        }

        if(isset($filters['table_number'])){
            $query->where('table_number', $filters['table_number']);
        }

        if(isset($filters['date_from'])){
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if(isset($filters['date_to'])){
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if(isset($filters['today']) && $filters['today']){
            $query->whereDate('created_at', today());
        }

        return $query->latest()->paginate($perPage);
    }
        

    public function createOrder($request){
        
        return DB::transaction(function () use ($request) {
            $validated_data = $request->validated();
            
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'employee_id' => $validated_data['employee_id'],
                'table_number' => $validated_data['table_number'],
                'status' => 'pending',
                'subtotal' => 0,
                'total_discount' => 0,
                'total_amount' => 0,
            ]);

            foreach ($validated_data['items'] as $item) {
                $this->createOrderItem($order, $item);
            }

            $order->calculateTotalAmount();
            $order->save();

            return $order->load('orderItems', 'employee');
        });
    }

    private function createOrderItem($order, $item){
        $menuItem = MenuItem::findOrFail($item['menu_item_id']);
        
        $discount = null;
        $discountName = null;
        $discountType = null;
        $discountAmount = 0;
        
        if(isset($item['discount_id'])){
            $discount = Discount::where('id', $item['discount_id'])
                ->where('active', true)
                ->first();

            if ($discount && !$discount->menuItems->contains($menuItem->id)) {
                $discount = null;
            }

            if ($discount) {
                $discountName = $discount->name;
                $discountType = $discount->type;
            }
        }

        $subtotal = $menuItem->price * $item['quantity'];

        if ($discount) {
            if ($discount->type === 'percentage') {
                $discountAmount = ($subtotal * $discount->value) / 100;
            } elseif ($discount->type === 'fixed') {
                $discountAmount = min($subtotal, $discount->value);
            } elseif ($discount->type === 'buy1take1') {
                $freeQuantity = floor($item['quantity'] / 2);
                $discountAmount = $freeQuantity * $menuItem->price;
            }
        }

        $totalAmount = $subtotal - $discountAmount;
        
        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'menu_item_id' => $menuItem->id,
            'item_name' => $menuItem->name,
            'unit_price' => $menuItem->price,
            'quantity' => $item['quantity'],
            'subtotal' => $subtotal,
            'discount_id' => $discount ? $discount->id : null,
            'discount_name' => $discountName,
            'discount_type' => $discountType,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
        ]);

        return $orderItem;
    }

    public function getOrder($id){
        return Order::with('orderItems', 'employee')->findOrFail($id);
    }

    public function updateOrder($id, $request){
        $order = Order::findOrFail($id);
        $validated_data = $request->validated();

        $order->update($validated_data);
        return $order->fresh(['orderItems', 'employee']);
    }

    public function updateOrderStatus($id, $status){
        $order = Order::findOrFail($id);
        $order->update(['status' => $status]);
        return $order->fresh(['orderItems', 'employee']);
    }

    public function deleteOrder($id){
        $order = Order::findOrFail($id);
        
        if ($order->status === 'completed'){
            throw new \Exception('Order cannot be deleted because it is completed');
        }

        $order->delete();

        return $order;
    }

    public function getOrderStats($filters = []){
        $query = Order::query();

        if (isset($filters['date_from'])){
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])){
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (isset($filters['today']) && $filters['today']){
            $query->whereDate('created_at', today());
        }

        return [
            'total_orders' => (clone $query)->count(),
            'pending_orders' => (clone $query)->where('status', 'pending')->count(),
            'completed_orders' => (clone $query)->where('status', 'completed')->count(),
            'cancelled_orders' => (clone $query)->where('status', 'cancelled')->count(),
            'total_sales' => (clone $query)->where('status', 'completed')->sum('total_amount'),
            'total_discounts' => (clone $query)->where('status', 'completed')->sum('total_discount'),
        ];
    }
}