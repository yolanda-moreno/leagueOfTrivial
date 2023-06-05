<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->bigInteger('idGame')->unsigned();
            $table->bigInteger('idChallenger')->unsigned();
            $table->bigInteger('idChallenged')->unsigned();
            $table->integer('winner');
            $table->timestamps();
            $table->primary(['idGame', 'idChallenger', 'idChallenged']);
            $table->foreign('idGame')->references('id')->on('games')->onDelete('cascade');
            $table->foreign('idChallenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('idChallenged')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('challenges');
    }
};
