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
        Schema::disableForeignKeyConstraints();
        Schema::create('groupes', function (Blueprint $table) {

            $table->string('code_filiere');
            $table->string('code_groupe')->primary(true);
            // $table->string('niveau');
            $table->integer('effectif');
            $table->integer('annee_formation');
            $table->string('status_groupe');
            $table->string('mode');
            $table->string('creneau');

            $table->foreign('code_filiere')
                ->references('code_filiere')
                ->on('filieres')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groupes');
    }
};
