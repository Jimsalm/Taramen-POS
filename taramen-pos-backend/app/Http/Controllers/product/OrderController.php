<?php

namespace App\Http\Controllers\product;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Responses\ApiResponse;

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

        return ApiResponse::success(
            $orders,
            'Orders retrieved successfully'
        );
    }
  
    public function store(OrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder($request);

            return ApiResponse::success(
                $order,
                'Order created successfully',
                201
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to create order',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }

    
    public function show($id)
    {
        try {
            $order = $this->orderService->getOrder($id);

            return ApiResponse::success(
                $order,
                'Order retrieved successfully'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to retrieve order',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }

    public function receipt($id)
    {
        try {
            $receipt = $this->orderService->getReceipt($id);

            return ApiResponse::success(
                $receipt,
                'Receipt retrieved successfully'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to retrieve receipt',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }
    
    public function update(OrderRequest $request, $id)
    {
        try {
            $order = $this->orderService->updateOrder($id, $request);

            return ApiResponse::success(
                $order,
                'Order updated successfully'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to update order',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }

    public function updateStatus(OrderRequest $request, $id)
    {
        try {
            $order = $this->orderService->updateOrderStatus($id, $request->status);

            return ApiResponse::success(
                $order,
                'Order status updated successfully'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to update order status',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }

    
    public function destroy($id)
    {
        try {
            $order = $this->orderService->deleteOrder($id);

            return ApiResponse::success(
                $order,
                'Order deleted successfully'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to delete order',
                500,
                ['error' => $e->getMessage()]
            );
        }
    }

    public function stats(OrderRequest $request)
    {
        $filter = $request->validated();

        $stats = $this->orderService->getOrderStats($filter);

        return ApiResponse::success(
            $stats,
            'Order stats retrieved successfully'
        );
    }
}
