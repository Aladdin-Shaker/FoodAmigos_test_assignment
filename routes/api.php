<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// AUTH ROUTES
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'getProducts']);

Route::get('/product/{id}', [ProductController::class, 'getProduct']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // BASKET

    Route::get('/basket', [BasketController::class, 'getBasket']);

    Route::post('/basket/add/{product_id}', [BasketController::class, 'addToBasket']);

    Route::post('/basket/remove/{product_id}', [BasketController::class, 'removeFromBasket']);

    // ORDER

    Route::get('/orders', [OrderController::class, 'getUserOrders']);

    Route::get('/orders/{id}', [OrderController::class, 'getOrderDetails']);

    Route::post('/order', [OrderController::class, 'placeOrder']);
});
