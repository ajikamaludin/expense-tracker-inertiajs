<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'date',
        'amount',
        'description',
        'is_income',
        'income_type',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }
}
