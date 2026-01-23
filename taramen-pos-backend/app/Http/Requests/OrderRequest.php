<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'employee_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'integer',
                'exists:employees,id'
            ],
            'table_number' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:50'
            ],
            'status' => [ 'sometimes', 'in:pending,completed,cancelled' ],
            'items' => [ $isUpdate ? 'sometimes' : 'required', 'array', 'min:1' ],
            'items.*.menu_item_id' => [ 'required', 'integer', 'exists:menu_items,id' ],
            'items.*.quantity' => [ 'required', 'integer', 'min:1' ],
            'items.*.discount_id' => [ 'sometimes', 'integer', 'exists:discounts,id' ],
        ];

        return $rules;
    }
}
