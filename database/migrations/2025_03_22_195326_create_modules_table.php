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
        Schema::create('modules', function (Blueprint $table) {
            // $table->id();
            $table->string('code_module');
            $table->string('libelle_module');
            $table->string('code_filiere');
            $table->enum('regional',['O','N']);
            $table->string('status')->nullable();

            $table->float('nbh_p_s1'); // nombre heures en presentiel
            $table->float('nbh_sync_s1'); // nombre heures en synchrone
            $table->float('nbh_async_s1'); // nombre heures en asynchrone
            $table->float('nbh_total_s1'); // nombre heures total
            
            $table->float('nbh_p_s2');
            $table->float('nbh_sync_s2'); 
            $table->float('nbh_async_s2'); 
            $table->float('nbh_total_s2');

            $table->float('nbh_p_total');
            $table->float('nbh_sync_total'); 
            $table->float('nbh_async_total'); 
            $table->float('nbh_total_global');
            // $table->integer('nbcc');

            $table->enum('semestre',['s1','s2','année']);
            // dates de debut et fin d'un module au niveau de formation :
            // $table->date('debut_module')->nullable();
            // $table->date('fin_module')->nullable();

            // dates efms :
            // $table->date('date_efm_prevu')->nullable();
            // $table->date('date_efm_reelle')->nullable();

            

            $table->foreign('code_filiere')
            ->references('code_filiere')
            ->on('filieres');

            $table->primary(['code_filiere','code_module']);

            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
