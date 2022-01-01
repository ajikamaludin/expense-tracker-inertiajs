<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Budget;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['category:name,id']);

        if ($request->q != null) {
            $query->where('description', 'like', '%'.$request->q.'%');
        }

        $startDate = now()->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        if ($request->startDate != null && $request->endDate != null) {
            $startDate = $request->startDate;
            $endDate = $request->endDate;
        }

        $query->whereBetween('date', [$startDate, $endDate]);

        return inertia('Transaction', [
            'transactions' => $query->orderBy('date', 'desc')->paginate(10),
            '_search' => $request->q,
            '_startDate' => $startDate,
            '_endDate' => $endDate
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|required_if:is_income,0|exists:categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|max:999999999|min:1',
            'description' => 'nullable|string',
            'is_income' => 'required|in:0,1', // 0 expense, 1 income
            'income_type' => 'required|in:0,1' // 0 cash out , 1 cash in
        ]);

        DB::beginTransaction();
        $transaction = Transaction::create($request->input());

        if ($request->is_income == 0) {
            $budget = $transaction->category->budgets()->where('end_date', null)->first();
            $budget->update(['total_used' => $budget->total_used + $request->amount]);
            if ($request->income_type == 1) {
                $budget->update([
                    'remain' => $budget->remain + $request->amount
                ]);
            } else {
                $budget->update([
                    'remain' => $budget->remain - $request->amount
                ]);
            }
        }

        DB::commit();

        return redirect()->back();
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'category_id' => 'nullable|required_if:is_income,0|exists:categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|max:999999999|min:1',
            'description' => 'nullable|string',
            'is_income' => 'required|in:0,1', // 0 expense, 1 income
            'income_type' => 'required|in:0,1' // 0 cash out , 1 cash in
        ]);

        DB::beginTransaction();
        if ($transaction->is_income == 0) {
            $budget = $transaction->category->budgets()->where('end_date', null)->first();
            $budget->update(['total_used' => $budget->total_used - $transaction->amount]);
            if ($transaction->income_type == 1) {
                $budget->update([
                    'remain' => $budget->remain - $transaction->amount
                ]);
            } else {
                $budget->update([
                    'remain' => $budget->remain + $transaction->amount
                ]);
            }
        }

        $transaction->update($request->input());

        if ($transaction->is_income == 0) {
            $budget = Budget::where([
                ['end_date', '=', null],
                ['category_id', '=', $transaction->category_id]
            ])->first();
            $budget->update(['total_used' => $budget->total_used + $request->amount]);
            if ($request->income_type == 1) {
                $budget->update([
                    'remain' => $budget->remain + $request->amount
                ]);
            } else {
                $budget->update([
                    'remain' => $budget->remain - $request->amount
                ]);
            }
        }
        DB::commit();

        return redirect()->route('transactions');
    }

    public function destroy(Transaction $transaction)
    {
        DB::beginTransaction();
        if ($transaction->is_income == 0 && $transaction->category->deleted_at == null) {
            $budget = $transaction->category->budgets()->where('end_date', null)->first();
            $budget->update(['total_used' => $budget->total_used - $transaction->amount]);
            if ($transaction->income_type == 1) {
                $budget->update([
                    'remain' => $budget->remain - $transaction->amount
                ]);
            } else {
                $budget->update([
                    'remain' => $budget->remain + $transaction->amount
                ]);
            }
        }

        $transaction->delete();
        DB::commit();
        return redirect()->route('transactions');
    }
}
