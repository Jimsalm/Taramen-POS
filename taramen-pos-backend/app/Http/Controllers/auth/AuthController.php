<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthController extends Controller
{

    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(AuthRequest $request){
        
        $data = $this->authService->login($request->validated());

        return response($data, 201);
    }

    public function logout(Request $request){
        $this->authService->logout($request->user());
        return response([
            'message' => 'Logged out'
        ]);
    }
}
