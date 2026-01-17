<?php

namespace App\Http\Product\Controllers;

use App\Http\Requests\DiscountRequest;
use App\Http\Controllers\Controller;
use App\Models\Discount;


class DiscountController extends Controller
{

    public function index()
    {
        $discounts = Discount::all();
        return response()->json([
            'data' => $discounts
        ],200);
    }


    public function store(DiscountRequest $request)
    {
        $validated_data = $request->validate();
        $created_discount = Discount::create($validated_data);
        return response()->json([
            'message' => "Discount has been created successfully",
            'discount' => $created_discount
        ],201);

    }


    public function show( $id)
    {
        $discount = Discount::findOrFail($id);
        return response()->json([
            'message' => 'discount found',
            'discount' => $discount
        ],200);
    }


    public function update(DiscountRequest $request,  $id)
    {
        $discount = Discount::findOrFail($id);
        $validated_data = $request->validate();
        $discount->update($validated_data);

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
