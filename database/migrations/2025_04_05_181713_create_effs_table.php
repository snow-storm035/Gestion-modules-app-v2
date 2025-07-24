<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('effs', function (Blueprint $table) {
            $table->id();

            $table->string('code_filiere');
            $table->date('date_eff_normal')->nullable();
            $table->date('date_eff_rattrapage')->nullable();

            $table->string('annee_scolaire');

            $table->foreign('code_filiere')
                ->references('code_filiere')
                ->on('filieres');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effs');
    }
};
