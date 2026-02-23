<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $items = ['ramen', 'tonkatsu', 'sushi', 'gyoza' , 'sashimi'];
        // $description = ['long noodles', 'crispy pork', 'classic delicacy', 'fried pork dumpling', 'raw edible fish'] ;

        $category_names = ['ramen', 'rice bowls', 'platters', 'drinks' ];
        $category_descriptions = ['hot noodles', 'meals with toppings', 'good for 4', 'good for authentic dining experience' ];

        foreach($category_names as $key => $name){
            Category::create([
                'name' => $name,
                'description' => $category_descriptions[$key]

            ]);
        }
    }
}
