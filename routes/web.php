<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SummaryController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ExpenseController::class, 'index'])->name('transactions');
Route::post('/transactions', [ExpenseController::class, 'store'])->name('transactions.store');
Route::put('/transactions/{transaction}', [ExpenseController::class, 'update'])->name('transactions.update');
Route::delete('/transactions/{transaction}', [ExpenseController::class, 'destroy'])->name('transactions.destroy');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories');
Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

Route::get('/summary', SummaryController::class)->name('summary');
Route::get('/close', [SummaryController::class, 'close'])->name('close');
