<?php

namespace App\Exports;

use App\Models\Transaction;
use App\Models\Budget;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;

class SummaryExport implements FromCollection
{
    use Exportable;

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $dataExports = [];

        $dataExports[] = [
            'Sisa Income :',
            Transaction::where('is_income', 1)->sum('amount') - Transaction::where('is_income', 0)->sum('amount')
        ];

        $dataExports[] = [
            'Total Saving :',
            Transaction::where('is_income', 1)->sum('amount') - Transaction::where('is_income', 0)->sum('amount') + Budget::where('end_date', null)->sum('rollover')
        ];

        $dataExports[] = [''];

        $dataExports[] = ['date', 'category', 'description', 'amount'];
        $transactions = Transaction::where('is_income', 0)->with(['category'])->get();
        foreach ($transactions as $transaction) {
            $dataExports[] = [
                $transaction->date,
                $transaction->category->name,
                $transaction->description,
                $transaction->amount,
            ];
        }

        $dataExports[] = [''];

        $dataExports[] = ['category', 'description', 'budget amount', 'previous budget amount', 'total_expense', 'remain per category'];
        $budgets = Budget::where('end_date', null)->with(['category'])->get();
        foreach ($budgets as $budget) {
            $dataExports[] = [
                $budget->category->name,
                $budget->category->description,
                $budget->budget,
                $budget->rollover,
                $budget->total_used,
                $budget->remain,
            ];
        }

        return collect($dataExports);
    }
}
