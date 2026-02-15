<?php

namespace App\Http\Controllers\product;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Responses\ApiResponse;
use Illuminate\Support\Facades\Log;

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
            return $this->internalErrorResponse('Failed to create order', $e, [
                'action' => 'orders.store',
            ]);
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
            return $this->internalErrorResponse('Failed to retrieve order', $e, [
                'action' => 'orders.show',
                'order_id' => $id,
            ]);
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
            return $this->internalErrorResponse('Failed to update order', $e, [
                'action' => 'orders.update',
                'order_id' => $id,
            ]);
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
            return $this->internalErrorResponse('Failed to update order status', $e, [
                'action' => 'orders.updateStatus',
                'order_id' => $id,
            ]);
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
            return $this->internalErrorResponse('Failed to delete order', $e, [
                'action' => 'orders.destroy',
                'order_id' => $id,
            ]);
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

    private function internalErrorResponse(string $message, \Throwable $exception, array $context = [])
    {
        Log::error($message, array_merge($context, [
            'error' => $exception->getMessage(),
        ]));

        return ApiResponse::error($message, 500);
    }
}
