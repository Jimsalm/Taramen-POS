<?php

namespace App\Http\Controllers\product;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ApiResponse::success(
            Category::all(),
            'Categories retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return ApiResponse::success(
            $category,
            'Category created successfully',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::findOrFail($id);
        return ApiResponse::success(
            $category,
            'Category retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, string $id)
    {
        $category = Category::findOrFail($id);

        $category->update($request->validated());
        
        return ApiResponse::success(
            $category,
            'Category updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        $category->delete();

        return ApiResponse::success(
            $category,
            'Category deleted successfully'
        );
    }
}
