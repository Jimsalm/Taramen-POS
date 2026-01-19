<?php

namespace App\Http\Product\Controllers;

use App\Http\Requests\DiscountRequest;
use App\Http\Controllers\Controller;
use App\Services\DiscountService;


class DiscountController extends Controller
{
    protected $discountService;

    public function __construct(DiscountService $discountService)
    {
    }

    public function index()
    {
       $discounts = $this->discountService->getAllDiscount();
       response()->json([
            "message" => 'discounts fetched successfully',            
            'data' => $discounts
        ],200);
    }

    public function getAllActive(){
        $active_discounts = $this->discountService->getAllActiveDiscounts();

        if(!$active_discounts){
            return response()->json([
                'message' => 'failed to get active discounts or no discounts found'
            ],404);
        }

        return response()->json([
            'message' => 'active discounts have been fetched successfully',
            'active_discounts' => $active_discounts,
        ],200);

    }


    public function store(DiscountRequest $request)
    {
        $validated_data = $request->validate();
        $created_discount = $this->discountService->createDiscount($request);
        $created_discount->menuItems()->attach($validated_data['menu_items_id']);
        return response()->json([
            'message' => "Discount has been created successfully",
            'discount' => $created_discount
        ],201);

    }


    public function show( $id)
    {
        $discount = $this->discountService->getOneDiscount($id);
        return response()->json([
            'message' => 'discount found',
            'discount' => $discount
        ],200);
    }


    public function update(DiscountRequest $request,  $id)
    {
        $payload = $this->discountService->updateDiscount($request, $id);
        $discount = $payload[0];
        $validated_data = $payload[1];
        $discount->menuItems()->sync($validated_data['menu_items_id']);
        
        return response()->json([
            'message' => 'discount has been updated successfully',
            'updated_discount' => $validated_data
        ],201);

    }

    public function destroy( $id)
    {
        $discount = $this->discountService->deleteDiscount($id);
        return response()->json([
            'message' => 'Discount deleted successfully',
            'category' => $discount
        ], 200);

    }
}
