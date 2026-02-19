<?php

namespace App\Http\Controllers\product;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\DiscountTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Models\DiscountType;
use App\Services\DiscountTypeService;

class DiscountTypeController extends Controller
{
    private DiscountTypeService $discountTypeService;

    public function __construct(DiscountTypeService $discountTypeService){
        $this->discountTypeService = $discountTypeService;
    }    

    public function getDiscountTypes(){

        try{
            
            $discountTypes = $this->discountTypeService->getDiscountTypes();
            ApiResponse::success(
                $discountTypes,
                'Discount types fetched successfully',
    
            );
        }catch(\Exception $e){
            ApiResponse::error(
                'Failed to get discount types', 500
            );
        }

    }

    public function createDiscountTypes(DiscountTypeRequest $request){
        try{
            $discountType = $this->discountTypeService->createDiscountType($request);
            
            ApiResponse::success(
                $discountType,
                'Discount type created successfully',
            );
        }catch(\Exception $e){
            ApiResponse::error(
                'Failed to create discount type', 500
            );
        }

    }
    public function updateDiscountTypes(DiscountTypeRequest $request, $id ){

        try{

            $discountType = $this->discountTypeService->updateDiscountType($request, $id);
    
    
            ApiResponse::success(
                $discountType,
                'Discount type updated successfully',
            );
        }catch(\Exception $e){
            ApiResponse::error(
                'Failed to update discount type', 500
            );
        }
    }
    public function deleteDiscountTypes($id ){

        try{

            $discountType = $this->discountTypeService->deleteDiscountType($id);
            ApiResponse::success(
                $discountType,
                'Discount type deleted successfully',
            );
        }catch(\Exception $e){
            ApiResponse::error(
                'Failed to delete discount type', 500
            );
        }

    }
}
