<?php

namespace App\Services;

use App\Models\Employee;
use Exception;

class EmployeeService
{
    public function listActiveEmployees(){
        return Employee::where('active', true)->get();
    }

    public function getAllEmployees(){
        return Employee::all();
    }

    public function createEmployee(array $data){
        $data['active'] = true;
        return Employee::create($data);
    }

    public function getEmployee($id){
        return Employee::findOrFail($id);
    }

    public function updateEmployee(Employee $employee, array $data){
        $employee->update($data);
        return $employee;
    }

    public function toggleStatus($id){
        $employee = Employee::findOrFail($id);

        $employee->active = ! $employee->active;
        $employee->save();

        return $employee;
    }

    public function deleteEmployee($id){
        $employee = Employee::findOrFail($id);

        $employee->delete();
    }
}