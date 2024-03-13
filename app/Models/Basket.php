<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Basket extends Model
{
    use HasFactory;

    protected $fillable = ['user_id']; // Define fillable fields

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function basketItems()
    {
        return $this->hasMany(BasketItem::class);
    }

    public function getTotalPrice()
    {
        $totalPrice = 0;
        foreach ($this->basketItems as $item) {
            $totalPrice += $item->quantity * $item->price;
        }
        return $totalPrice;
    }
}
