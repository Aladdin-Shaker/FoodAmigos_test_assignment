<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BasketController extends Controller
{
    public function getBasket()
    {
        $user = Auth::user();

        // Retrieve user's basket or create a new one if it doesn't exist
        $basket = $user->basket()->firstOrCreate([]);

        // Load basket items with related product details (eager loading)
        $basket->load('basketItems.product');

        $data = ['items' => $basket->basketItems, 'total_price' => $basket->getTotalPrice()];

        return response()->json($data);
    }

    // Add product to basket
    public function addToBasket(Request $request, $productId)
    {
        $user = Auth::user();

        $basket = $user->basket()->firstOrCreate([]);

        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $existingItem = $basket->basketItems()->where('product_id', $productId)->first();

        if ($existingItem) {
            $existingItem->update(['quantity' => $existingItem->quantity + $validatedData['quantity']]);
        } else {
            $basket->basketItems()->create([
                'product_id' => $productId,
                'quantity' => $validatedData['quantity'],
                'price' => $product->price,
            ]);
        }

        return response()->json(['message' => 'Product added to basket successfully!']);
    }


    // Remove product from basket
    public function removeFromBasket($productId)
    {
        $user = Auth::user();

        $basket = $user->basket()->first();

        if (!$basket) {
            return response()->json(['message' => 'Basket not found'], 404);
        }

        $item = $basket->basketItems()->where('product_id', $productId)->first();

        if (!$item) {
            return response()->json(['message' => 'Product not found in the basket'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Product removed from basket successfully!']);
    }
}
