<?php

namespace App\Services;

use App\Models\Discount;

class DiscountService{

    public function getAllDiscount(){
        return Discount::with('menuItems')->get();
    }

    public function getAllActiveDiscounts(){
       return Discount::with('menuItems')->where('active', true)->get();
    }

    public function createDiscount($request){
        
        $discount = Discount::create($request->validated());
        
        if (isset($request->menu_items_id)) {
            $discount->menuItems()->attach($request->menu_items_id);
        }

        return $discount->load('menuItems');
    }
    
    public function getOneDiscount($id){
        return Discount::with('menuItems')->findOrFail($id);
    }
    public function updateDiscount($request, $id){
        $discount = Discount::findOrFail($id);
        $validated_data = $request->validate();
        $discount->update($validated_data);
        return [$discount, $validated_data];
    }
    public function deleteDiscount($id){
        $discount = Discount::findOrFail($id);
        $discount->delete();
        return $discount;
    }
}