<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menu_name = ['spicy ramen', 'tonkatsu bowl' , 'sushi platters', 'red tea', 'karaage bowl'];
        $category_menu = [1 ,2,3,4,2];

        foreach ($menu_name as $key => $name){
            MenuItem::create([
                'name' => $name,
                'price' => rand(100,299),
                'category_id' => $category_menu[$key],
                'available' => true,
            ]);
        }
    }
}
