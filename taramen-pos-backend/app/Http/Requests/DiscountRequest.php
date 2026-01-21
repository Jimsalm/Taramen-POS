<?php

namespace App\Http\Requests;

use App\Enum\DiscountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;


class DiscountRequest extends FormRequest

{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isUpdate = $this->routeIs('*.update');

        $rules = [
            'type' => [
                $isUpdate ? 'sometimes' : 'required', 
                new Enum(DiscountType::class)
            ],
            
            'value' => [
                $isUpdate ? 'sometimes' : 'required', 
                'numeric', 
                'min:0'
            ],
            
            'active' => ['sometimes', 'boolean'],

            'menu_items_id' => ['nullable', 'array'],
            'menu_items_id.*' => ['exists:menu_items,id'], 
        ];

        $discount_id = $this->route('id') ?? $this->route('discounts');

        $rules['name'] = [
            $isUpdate ? 'sometimes' : 'required',
            'string',
            'max:255',
            Rule::unique('discounts', 'name')->ignore($discount_id)
        ];

        return $rules;
    }
}
