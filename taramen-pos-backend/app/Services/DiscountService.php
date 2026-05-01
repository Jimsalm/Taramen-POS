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
    public function updateDiscount(Discount $discount, array $validatedData){
        $discount->update($validatedData);

        if (array_key_exists('menu_items_id', $validatedData)) {
            $discount->menuItems()->sync($validatedData['menu_items_id'] ?? []);
        }

        return $discount->load('menuItems');
    }
    public function deleteDiscount($id){
        $discount = Discount::findOrFail($id);
        $discount->delete();
        return $discount;
    }
}
