<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\EmployeeService;
use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;


class EmployeeController extends Controller
{
    public function __construct(protected EmployeeService $employeeService)
    {}

    public function index(){
        return response()->json($this->employeeService->listActiveEmployees());
    }

    public function getAllEmployees(){
        return response()->json($this->employeeService->getAllEmployees());
    }

    public function store(EmployeeRequest $request){
        $employee = $this->employeeService->createEmployee($request->validated());

        return response()->json([
            'message' => 'Employee created successfully',
            'data' => $employee
        ], 201);
    }

    public function show($id){
        $employee = $this->employeeService->getEmployee($id);
        
        return response()->json([
            'message' => 'Employee retrieved successfully',
            'data' => $employee
        ]);
    }

    public function update(EmployeeRequest $request, string $id){
        $employee = Employee::findOrFail($id);
        $employee = $this->employeeService->updateEmployee($employee, $request->validated());

        return response()->json([
            'message' => 'Employee updated successfully',
            'data' => $employee
        ]);
    }

    public function toggleStatus(string $id){
        $employee = $this->employeeService->toggleStatus($id);
        
        return response()->json([
            'message' => 'Employee status toggled successfully',
            'data' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'active' => $employee->active
            ]
        ]);
    }

    public function destroy(string $id){
        try{
            $this->employeeService->deleteEmployee($id);
            
            return response()->json([
                'message' => 'Employee deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
