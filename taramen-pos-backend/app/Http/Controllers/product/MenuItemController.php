<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Http\Requests\MenuItemRequest;
use App\Services\MenuItemService;

class MenuItemController extends Controller
{

    public function __construct(
        protected MenuItemService $menuItemService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(MenuItem::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuItemRequest $request)
    {
        $menuItem = $this->menuItemService->createMenuItem($request->validated(), $request->file('image'));

        return response()->json([
            'message' => 'Menu item created successfully',
            'data' => $menuItem
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menuItem = $this->menuItemService->getMenuItem($id);

        return response()->json([
            'message' => 'Menu item retrieved successfully',
            'data' => $menuItem
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuItemRequest $request, string $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $updateItem = $this->menuItemService->updateMenuItem(
            $menuItem,
            $request->validated(),
            $request->file('image'),
        );

        return response()->json([
            'message' => 'Menu item updated successfully',
            'data' => $updateItem
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $this->menuItemService->archiveMenuItem($id);

        return response()->json([
            'message' => 'Menu item archived successfully',
            'data' => $menuItem
        ]);
    }

    public function restore($id)
    {
        $this->menuItemService->restoreMenuItem($id);

        return response()->json([
            'message' => 'Menu item restored successfully'
        ]);
    }
}
