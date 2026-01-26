<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Employee;


class ReportService {
    public function summaryService($start, $end){
        $summary_data =Order::whereBetween('created_at', [$start, $end])->selectRaw(
            'COUNT * as total_orders,
            SUM(subtotal),
            SUM(total_discount),
            SUM(total_amount)
            '
        )->first();
        return $summary_data;
    }

    public function employeeService($start, $end){
        $employee_data = Order::whereBetween('created_at', [$start, $end])->join('employees', 'orders.employee_id','=','employee.id')->selectRaw(
            'employees.id as employee_name,
                COUNT(orders.id) as total_orders,
                SUM(total_amount)
            '
        )->groupBy('employees.id', 'employees.name')->get();

        return $employee_data;
    }

    public function topItemService($start, $end){
       $orderItem_data  = OrderItem::whereBetween('created_at', [$start, $end])->join('orders', 'order_items.order_id', '=', 'orders.id')->
        where('order_items.is_free', false)->
        selectRaw("
            order_items.name as item_name,
            COUNT(order_items.orders_id) as total_orders,
            SUM(order_items.total_amount) as total_amount,
        ")->orderBy('total_orders', 'desc')
        ->groupBy('item_name')
        ->limit(10)
        ->get();

        return $orderItem_data;
    }


}
