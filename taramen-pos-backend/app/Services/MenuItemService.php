<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MenuItemService {

    public function createMenuItem(array $data, ?UploadedFile $image = null){
        
        if ($image){
            $data['image'] = $image->store('menu_items', 'public');
        }

        return MenuItem::create($data);
    }

    public function getMenuItem($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);

        return $menuItem;
    }

    public function updateMenuItem(MenuItem $menuItem, array $data, ?UploadedFile $image = null){
        
        if ($image){
            if($menuItem->image) {
                Storage::disk('public')->delete($menuItem->image);
            }
            $data['image'] = $image->store('menu_items', 'public');
        }

        $menuItem->update($data);

        return $menuItem;
    }

    public function archiveMenuItem($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);

        $menuItem->delete();

        $menuItem->update([
            'available' => false
        ]);
    }

    public function restoreMenuItem($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);

        $menuItem->restore();

        $menuItem->update([
            'available' => true
        ]);
    }

    public function toggleAvailability($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);
        $menuItem->available = !$menuItem->available;
        $menuItem->save();

        return $menuItem;
    }
    
}