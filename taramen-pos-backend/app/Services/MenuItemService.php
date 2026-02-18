<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MenuItemService {

    public function createMenuItem(array $data, ?UploadedFile $image = null){
        $data = $this->normalizeStatusFields($data);
        
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
        $data = $this->normalizeStatusFields($data);
        
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
            'status' => false,
            'available' => false
        ]);
    }

    public function restoreMenuItem($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);

        $menuItem->restore();

        $menuItem->update([
            'status' => true,
            'available' => true
        ]);
    }

    public function toggleAvailability($id){
        $menuItem = MenuItem::withTrashed()->findOrFail($id);
        $menuItem->available = !$menuItem->available;
        $menuItem->status = $menuItem->available;
        $menuItem->save();

        return $menuItem;
    }

    private function normalizeStatusFields(array $data): array
    {
        if (array_key_exists('status', $data)) {
            $data['available'] = (bool) $data['status'];
        } elseif (array_key_exists('available', $data)) {
            $data['status'] = (bool) $data['available'];
        }

        return $data;
    }
    
}
