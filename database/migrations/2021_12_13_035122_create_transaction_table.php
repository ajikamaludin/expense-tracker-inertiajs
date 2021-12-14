<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->integer('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->nullable();
            $table->date('date')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('description')->nullable();
            $table->smallInteger('is_income')->default(0); // 0 expense, 1 income
            $table->smallInteger('income_type')->nullable(); // 0 is cash in , 1 is cash out
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
