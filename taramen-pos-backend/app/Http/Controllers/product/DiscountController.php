<?php

namespace App\Http\Controllers\product;

use App\Http\Requests\DiscountRequest;
use App\Http\Controllers\Controller;
use App\Models\Discount;
use App\Services\DiscountService;


class DiscountController extends Controller
{

    public function __construct(protected DiscountService $discountService)
    {
    }

    public function index()
    {
       $discounts = $this->discountService->getAllDiscount();

       return response()->json([
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
        $created_discount = $this->discountService->createDiscount($request);

        return response()->json([
            'message' => "Discount has been created successfully",
            'discount' => $created_discount
        ],201);

    }


    public function show($id)
    {
        $discount = $this->discountService->getOneDiscount($id);
        return response()->json([
            'message' => 'discount found',
            'discount' => $discount
        ],200);
    }


    public function update(DiscountRequest $request,  $id)
    {
        $discount = Discount::findOrFail($id);
        $validated_data = $request->validated();
        $discount->update($validated_data);

        if (array_key_exists('menu_items_id', $validated_data)) {
            $discount->menuItems()->sync($validated_data['menu_items_id']);
        }

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
