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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            // $table->string('avancement_id');
            $table->string('code_filiere');
            $table->string('code_groupe');
            $table->string('code_module');

            $table->unique(['code_filiere','code_groupe','code_module']);

            // $table->string('matricule');
            $table->string('etat')->nullable();
            $table->float('mhrestante')->nullable();
            $table->date('date_fin_prevu')->nullable();

            $table->foreignId('avancement_id')
                ->constrained()
                ->on('groupe_formateur_module');

            // $table->foreign(['code_module', 'matricule', 'code_groupe'])
            //     ->references(['code_module', 'matricule', 'code_groupe'])
            //     ->on('groupe_formateur_module')
            //     ->onDelete('cascade')
            //     ->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
