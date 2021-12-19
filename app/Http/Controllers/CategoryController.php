<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        return inertia('Category', [
            'categories' => Category::orderBy('created_at', 'asc')->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->where(function ($query) {
                    return $query->where('deleted_at', null);
                })
            ],
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|max:999999999|min:1'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'default_budget' => $request->amount
        ]);

        $category->budgets()->create([
            'budget' => $request->amount,
            'start_date' => now()->toDateString(),
            'end_date' => null,
            'remain' => $request->amount
        ]);

        return redirect()->route('categories');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|max:999999999|min:1'
        ]);

        $category->update([
            'name' => $request->name,
            'description' => $request->description,
            'default_budget' => $request->amount,
        ]);

        $budget = $category->budgets()->where('end_date', null);
        $budget->update(['budget' => $request->amount]);

        return redirect()->route('categories');
    }

    public function destroy(Category $category)
    {
        $category->budgets()->delete();
        $category->delete();

        return redirect()->route('categories');
    }
}
