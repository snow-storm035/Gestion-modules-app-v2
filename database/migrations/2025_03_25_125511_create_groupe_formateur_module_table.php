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
        Schema::create('groupe_formateur_module', function (Blueprint $table) {

            $table->id();

            $table->string('code_module')->nullable();
            $table->string('code_filiere')->nullable();
            $table->string('matricule')->default("none")->nullable(); 
            $table->string('code_groupe')->nullable();

            $table->foreign(["code_filiere","code_module"])
                ->references(["code_filiere","code_module"])
                ->on('modules')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign("matricule")
                ->references("matricule")
                ->on('formateurs')
                ->onDelete('restrict')
                ->onUpdate('cascade')
                ->nullable();

            $table->foreign("code_groupe")
                ->references("code_groupe")
                ->on('groupes')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->unique(['code_module', 'matricule', 'code_groupe']);



            $table->float('nbh_par_semaine_p')->default(2.5);
            $table->float('nbh_par_semaine_sync')->default(2.5);
            $table->float('nbh_par_semaine_total')->default(2.5);
            // $table->date('date_debut')->nullable(); 
            // $table->date('date_fin')->nullable();

            $table->float('nbhp_realisee')->default(0);
            $table->float('nbhsync_realisee')->default(0);
            $table->float('nbh_total_realisee')->default(0);

            $table->float('prec_nbhp_realisee')->default(0);   // old values
            $table->float('prec_nbhsync_realisee')->default(0);
            $table->float('prec_nbh_total_realisee')->default(0);


            // $table->float('tauxp_realisee')->default(0);
            // $table->float('tauxsync_realisee')->default(0);
            $table->float('taux_total_realisee')->default(0);

            $table->integer('nbcc_realisee')->default(0);

            $table->enum('efm_realise',['oui','non'])->default('non');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groupe_formateur_module');
    }
};
