<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = FakerFactory::create();

        for ($i = 0; $i < 20; $i++) {
            Product::create([
                'name' => 'Product ' . ($i + 1),
                'description' => $faker->sentence(10),
                'imageUrl' => "https://placehold.co/600x400?text=" . ($i + 1),
                'price' => number_format(mt_rand(300, 500) / 100, 2), // Random price between 3.00 and 5.00 euros
            ]);
        }
    }
}
