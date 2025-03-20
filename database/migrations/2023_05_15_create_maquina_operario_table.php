<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaquinaOperarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('maquina_operario')) {
            Schema::create('maquina_operario', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('maquina_id');
                $table->unsignedBigInteger('user_id');
                $table->timestamps();

                $table->foreign('maquina_id')->references('id')->on('maquinas')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                
                $table->unique(['maquina_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maquina_operario');
    }
}
