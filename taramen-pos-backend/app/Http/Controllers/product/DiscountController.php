<?php

namespace App\Http\Controllers\Product;

use App\Enum\DiscountType;
use App\Http\Requests\DiscountRequest;
use App\Http\Controllers\Controller;
use App\Models\Discount;


class DiscountController extends Controller
{

    public function index()
    {
        $discounts = Discount::with('menuItems')->get();
        return response()->json([
            'data' => $discounts
        ],200);
    }

    public function getAllActive(){
        $active_discounts = Discount::with('menuItems')->where('active', true)->get();

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
        $validated_data = $request->validated();
        $created_discount = Discount::create($validated_data);
        $menuItemIds = $validated_data['menu_items_id'] ?? [];
       $isB1T1 = $validated_data['type'] === DiscountType::B1T1;


        if (!empty($menuItemIds) && $isB1T1) {
            $created_discount->menuItems()->attach($menuItemIds);
        }

        return response()->json([
            'message' => "Discount has been created successfully",
            'discount' => $created_discount
        ],201);

    }


    public function show( $id)
    {
        $discount = Discount::with('menuItems')->findOrFail($id);
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

        if($validated_data['menu_items_id'] && $validated_data['type'] == DiscountType::B1T1) {
            $discount->menuItems()->sync($validated_data['menu_items_id']);
        }

        return response()->json([
            'message' => 'discount has been updated successfully',
            'updated_discount' => $validated_data
        ],201);

    }

    public function destroy( $id)
    {
        $discount = Discount::findOrFail($id);
        $discount->delete();

        return response()->json([
            'message' => 'Discount deleted successfully',
            'category' => $discount
        ], 200);

    }
}
