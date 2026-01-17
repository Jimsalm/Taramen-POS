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
        $rules = [
            'type' => ['required' , new Enum(DiscountType::class)],
            'value' => [ 'required' ,'decimal:2'],
            'active' => ['boolean'],
        ];

        $discount_id = $this->route('id');

        $rules['name'] = [
            'required',
            'string',
            'max:255',
            Rule::unique('discounts', 'name')->ignore($discount_id)
        ];

        return $rules;
    }
}
