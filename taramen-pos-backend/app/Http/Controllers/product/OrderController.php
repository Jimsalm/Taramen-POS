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
    
    public function index(OrderRequest $request)
    {
        $filter = $request->validated();

        $perPage = $request->input('per_page', 10);
        $orders = $this->orderService->getFilteredOrders($filter, $perPage);

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

    public function updateStatus(OrderRequest $request, $id)
    {
        try {
            $order = $this->orderService->updateOrderStatus($id, $request->status);

            return response()->json([
                'message' => 'Order status updated successfully',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update order status',
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

    public function stats(OrderRequest $request)
    {
        $filter = $request->validated();

        $stats = $this->orderService->getOrderStats($filter);

        return response()->json([
            'message' => 'Order stats retrieved successfully',
            'data' => $stats
        ], 200);
    }
}
