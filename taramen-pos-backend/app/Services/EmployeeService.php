<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    public function listActiveEmployees(){
        return Employee::where('active', true)->get();
    }

    public function getAllEmployees(){
        return Employee::all();
    }

    public function createEmployee(array $data){
        if (!array_key_exists('active', $data)) {
            $data['active'] = true;
        }

        return Employee::create($data);
    }

    public function getEmployee($id){
        return Employee::findOrFail($id);
    }

    public function updateEmployee(Employee $employee, array $data){
        $employee->update($data);
        return $employee;
    }

    public function updateEmployeeProfile(Employee $employee, ?UploadedFile $profile = null): Employee
    {
        if (!$profile) {
            return $employee;
        }

        if ($employee->profile) {
            Storage::disk('public')->delete($employee->profile);
        }

        $employee->update([
            'profile' => $profile->store('employees', 'public'),
        ]);

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
