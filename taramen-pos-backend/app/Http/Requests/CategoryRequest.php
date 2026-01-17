<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
            'description' => 'nullable|string',
        ];

        if ($this->routeIs('categories.store')) {
            $rules['name'] = ['required', 'string', 'max:255', Rule::unique('categories', 'name')];
        }

        if ($this->routeIs('categories.update')) {
            $category_id = $this->route('category');
            $rules['name'] = ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category_id)];
        }

        return $rules;
    }
}
