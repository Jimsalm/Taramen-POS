<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}
    
    public function index(Request $request)
    {
        $filter = $request->only([
            'status',
            'employee_id',
            'table_number',
            'date_from',
            'date_to',
            'today'
        ]);

        $orders = $this->orderService->getFilteredOrders($filter);

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ], 200);
    }
  
    public function store(OrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder($request);

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function show($id)
    {
        try {
            $order = $this->orderService->getOrder($id);

            return response()->json([
                'message' => 'Order retrieved successfully',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function update(OrderRequest $request, $id)
    {
        try {
            $order = $this->orderService->updateOrder($id, $request);

            return response()->json([
                'message' => 'Order updated successfully',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function destroy($id)
    {
        try {
            $order = $this->orderService->deleteOrder($id);

            return response()->json([
                'message' => 'Order deleted successfully',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
