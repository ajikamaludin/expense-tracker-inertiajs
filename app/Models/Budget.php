<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Budget extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'rollover',
        'budget',
        'start_date',
        'end_date',
        'total_used',
        'remain'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }
}
