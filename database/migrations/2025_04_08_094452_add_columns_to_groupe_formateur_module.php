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
        Schema::table('groupe_formateur_module', function (Blueprint $table) {
            //
            // dates de debut et fin d'un module au niveau de formation :
                $table->string('debut_module')->nullable()->after('nbh_par_semaine_total');
                $table->string('fin_module')->nullable()->after('debut_module');
    
                // dates efms :
                $table->string('date_efm_prevu')->nullable()->after('fin_module');
                $table->string('date_efm_reelle')->nullable()->after('date_efm_prevu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('groupe_formateur_module', function (Blueprint $table) {
            //
        });
    }
};
