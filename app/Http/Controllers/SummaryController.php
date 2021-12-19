<?php

namespace App\Http\Controllers;

use DB;
use App\Exports\SummaryExport;
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
        $content = (new SummaryExport)->download('summary.xlsx', \Maatwebsite\Excel\Excel::XLSX);

        DB::beginTransaction();

        $budgets = Budget::where('end_date', null)->get();
        Budget::where('end_date', null)->update(['end_date' => now()->toDateString()]);

        if ($request->is_rolling == 1) {
            foreach ($budgets as $budget) {
                $rollover = ($budget->budget + $budget->rollover) - ($budget->total_used);
                Budget::create([
                    'category_id' => $budget->category_id,
                    'budget' => $budget->budget,
                    'rollover' => $rollover,
                    'remain' => $budget->budget + $rollover,
                    'start_date' => now()->toDateString(),
                    'end_date' => null,
                ]);
            }
        } else {
            foreach ($budgets as $budget) {
                Budget::create([
                    'category_id' => $budget->category_id,
                    'budget' => $budget->budget,
                    'remain' => $budget->budget,
                    'start_date' => now()->toDateString(),
                    'end_date' => null,
                ]);
            }
        }

        Transaction::where('date', '!=', null)->delete();

        DB::commit();

        return $content;
    }
}
