<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    public function __invoke()
    {
        return inertia('Summary', [
            'budgets' => Budget::where('end_date', null)->with(['category'])->paginate(10),
            'income' => Transaction::where('is_income', 1)->sum('amount'),
            'expense' => Transaction::where('is_income', 0)->sum('amount'),
            'balance' => Transaction::where('is_income', 1)->sum('amount') - Transaction::where('is_income', 0)->sum('amount')
        ]);
    }

    public function close(Request $request)
    {
        $request->validate([
            'is_rolling' => 'required|in:0,1'
        ]);

        if ($request->is_rolling == 1) {
            // rolling is count
        }
    }
}
