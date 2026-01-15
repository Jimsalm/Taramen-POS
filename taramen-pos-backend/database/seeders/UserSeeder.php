<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::where('email', 'admin@taramen.com')->exists()){
            User::create([
                'name' => 'Admin',
                'email' => 'admin@taramen.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]);
        }
    }
}
