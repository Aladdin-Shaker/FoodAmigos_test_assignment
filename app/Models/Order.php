<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'basket_id',
        'total_price',
        'note',
        'shipping_address',
    ];

    // Relationship with User model (optional)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with OrderItem model (optional) to store individual items in the order
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
