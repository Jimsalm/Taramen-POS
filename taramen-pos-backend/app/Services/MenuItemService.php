<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MenuItemService {

    public function getAvailableMenuItems(){
        return MenuItem::with(['category', 'bundleComponents.category'])
            ->where('available', true)
            ->get();
    }

    public function createMenuItem(array $data, ?UploadedFile $image = null){
        return DB::transaction(function () use ($data, $image) {
            $components = $data['components'] ?? [];
            unset($data['components']);

            $data['is_bundle'] = (bool) ($data['is_bundle'] ?? false);

            if ($image){
                $data['image'] = $image->store('menu_items', 'public');
            }
        $data = $this->normalizeStatusFields($data);
        
        if ($image){
            $data['image'] = $image->store('menu_items', 'public');
        }

            $menuItem = MenuItem::create($data);

            if ($menuItem->is_bundle) {
                $this->syncBundleComponents($menuItem, $components);
            }

            return $menuItem->fresh(['category', 'bundleComponents.category']);
        });
    }

    public function getMenuItem($id){
        $menuItem = MenuItem::withTrashed()
            ->with(['category', 'bundleComponents.category'])
            ->findOrFail($id);

        return $menuItem;
    }

    public function updateMenuItem(MenuItem $menuItem, array $data, ?UploadedFile $image = null){
        return DB::transaction(function () use ($menuItem, $data, $image) {
            $hasComponents = array_key_exists('components', $data);
            $components = $data['components'] ?? [];
            unset($data['components']);

            if ($image){
                if($menuItem->image) {
                    Storage::disk('public')->delete($menuItem->image);
                }
                $data['image'] = $image->store('menu_items', 'public');
        $data = $this->normalizeStatusFields($data);
        
        if ($image){
            if($menuItem->image) {
                Storage::disk('public')->delete($menuItem->image);
            }

            $willBeBundle = array_key_exists('is_bundle', $data)
                ? (bool) $data['is_bundle']
                : (bool) $menuItem->is_bundle;

            if ($hasComponents && !$willBeBundle) {
                throw ValidationException::withMessages([
                    'components' => ['Components are only allowed for bundle items.'],
                ]);
            }

            $menuItem->update($data);

            if (!$willBeBundle) {
                $menuItem->bundleComponents()->detach();
            } elseif ($hasComponents) {
                $this->syncBundleComponents($menuItem, $components);
            }

            return $menuItem->fresh(['category', 'bundleComponents.category']);
        });
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

    /**
     * @param list<array{menu_item_id: int, quantity: int}> $components
     */
    private function syncBundleComponents(MenuItem $bundleMenuItem, array $components): void
    {
        if (empty($components)) {
            $bundleMenuItem->bundleComponents()->detach();
            return;
        }

        $syncPayload = [];

        foreach ($components as $component) {
            $componentId = (int) ($component['menu_item_id'] ?? 0);
            $quantity = (int) ($component['quantity'] ?? 0);

            if ($componentId <= 0 || $quantity <= 0) {
                continue;
            }

            if ($componentId === (int) $bundleMenuItem->id) {
                throw ValidationException::withMessages([
                    'components' => ['A bundle cannot include itself as a component.'],
                ]);
            }

            if (isset($syncPayload[$componentId])) {
                $syncPayload[$componentId]['quantity'] += $quantity;
                continue;
            }

            $syncPayload[$componentId] = ['quantity' => $quantity];
        }

        $bundleMenuItem->bundleComponents()->sync($syncPayload);
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
