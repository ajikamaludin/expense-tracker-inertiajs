<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoriesQuery extends Controller
{
    public function __invoke(Request $request)
    {
        if ($request->q != null) {
            return Category::where('name', 'like', '%'.$request->q.'%')->limit(10)->get();
        }
        return Category::limit(10)->get();
    }
}
