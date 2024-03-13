<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function getUserOrders()
    {

        $orders = Auth::user()->orders()->with('orderItems.product')->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($orders);
    }

    public function getOrderDetails($orderId)
    {

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Order not found !'], 404);
        }
        $details = $order->with('orderItems.product')->where('user_id', Auth::id())->firstOrFail();
        return response()->json($details);
    }

    public function placeOrder(Request $request)
    {

        $user = Auth::user();

        // 1. Validation
        $validatedData = $request->validate([
            // 'shipping_address' => 'required|string',
            'note' => 'nullable|string'
        ]);

        // 2. Retrieve Basket

        $basket = $user->basket()->firstOrCreate([])->with('basketItems.product')->first();

        if (!$basket) {
            return response()->json(['message' => 'Basket not found'], 404);
        }

        // 3. Calculate Total Price
        $totalPrice = $basket->getTotalPrice();

        if ($totalPrice == 0 && $basket->basketItems->count() == 0) {
            return response()->json(['message' => 'Sorry your basket is empty'], 404);
        }

        if ($totalPrice < 15) {
            return response()->json(['message' => 'Minimum order amount has to be at least 15 eur'], 404);
        }

        // 4. Create Order
        $order = Order::create([
            'user_id' => $user->id,
            'shipping_address' => $user->shipping_address,
            'total_price' => $totalPrice,
            'basket_id' => $basket->id,
            'note' => $validatedData['note'],
        ]);

        // 5. Create Order Items
        foreach ($basket->basketItems as $item) {
            $order->orderItems()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
            ]);
        }

        // 6. Clear Basket
        $basket->basketItems()->delete();

        // 7. Process Payment

        // 8. Order Confirmation (optional)
        // ... send email confirmation or display success message to user ...

        return response()->json(['message' => 'Order placed successfully']);
    }
}
