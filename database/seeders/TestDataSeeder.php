<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Formateur;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Filiere
        $filiere = Filiere::create([
            'code_filiere' => 'FIL100',
            'nom_filiere' => 'Informatique',
            'type_formation' => 'Initiale',
            'niveau' => 'TS',
            'secteur' => 'Technologie'
        ]);

        // 2. Create Groupes
        $groupe1 = Groupe::create([
            'code_filiere' => $filiere->code_filiere,
            'code_groupe' => 'GRP1',
            'effectif' => 30,
            'annee_formation' => 2024,
            'status_groupe' => 'actif',
            'mode' => 'présentiel',
            'creneau' => 'matin'
        ]);
        $groupe2 = Groupe::create([
            'code_filiere' => $filiere->code_filiere,
            'code_groupe' => 'GRP2',
            'effectif' => 28,
            'annee_formation' => 2024,
            'status_groupe' => 'actif',
            'mode' => 'présentiel',
            'creneau' => 'après-midi'
        ]);

        // 3. Create Module
        $module = Module::create([
            'code_module' => 'M101',
            'libelle_module' => 'Programmation PHP',
            'code_filiere' => $filiere->code_filiere,
            'regional' => 'O',
            'status' => 'en cours',
            'nbh_p_s1' => 40,
            'nbh_sync_s1' => 10,
            'nbh_async_s1' => 5,
            'nbh_total_s1' => 55,
            'nbh_p_s2' => 30,
            'nbh_sync_s2' => 10,
            'nbh_async_s2' => 5,
            'nbh_total_s2' => 45,
            'nbh_p_total' => 70,
            'nbh_sync_total' => 20,
            'nbh_async_total' => 10,
            'nbh_total_global' => 100,
            'semestre' => 'année'
        ]);

        // 4. Create Formateur
        $formateur = Formateur::create([
            'matricule' => 'F001',
            'nom_formateur' => 'Ali Amine'
        ]);

        // 5. Create Avancement (pivot) - scenario 1: in progress, EFM not done
        DB::table('groupe_formateur_module')->insert([
            'code_module' => $module->code_module,
            'code_filiere' => $filiere->code_filiere,
            'matricule' => $formateur->matricule,
            'code_groupe' => $groupe1->code_groupe,
            'nbh_par_semaine_p' => 4,
            'nbh_par_semaine_sync' => 2,
            'nbh_par_semaine_total' => 6,
            'nbhp_realisee' => 30,
            'nbhsync_realisee' => 10,
            'nbh_total_realisee' => 40,
            'prec_nbhp_realisee' => 20,
            'prec_nbhsync_realisee' => 5,
            'prec_nbh_total_realisee' => 25,
            'taux_total_realisee' => 40,
            'nbcc_realisee' => 2,
            'efm_realise' => 'non',
            'debut_module' => Carbon::now()->subWeeks(4)->toDateString(),
            'fin_module' => null,
            'date_efm_prevu' => Carbon::now()->addWeeks(4)->toDateString(),
            'date_efm_reelle' => null,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 6. Create Avancement (pivot) - scenario 2: completed, EFM done
        DB::table('groupe_formateur_module')->insert([
            'code_module' => $module->code_module,
            'code_filiere' => $filiere->code_filiere,
            'matricule' => $formateur->matricule,
            'code_groupe' => $groupe2->code_groupe,
            'nbh_par_semaine_p' => 5,
            'nbh_par_semaine_sync' => 2,
            'nbh_par_semaine_total' => 7,
            'nbhp_realisee' => 70,
            'nbhsync_realisee' => 20,
            'nbh_total_realisee' => 100,
            'prec_nbhp_realisee' => 60,
            'prec_nbhsync_realisee' => 15,
            'prec_nbh_total_realisee' => 75,
            'taux_total_realisee' => 100,
            'nbcc_realisee' => 3,
            'efm_realise' => 'oui',
            'debut_module' => Carbon::now()->subWeeks(10)->toDateString(),
            'fin_module' => Carbon::now()->toDateString(),
            'date_efm_prevu' => Carbon::now()->subWeeks(1)->toDateString(),
            'date_efm_reelle' => Carbon::now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 7. Add a scenario to test calculerDateEFMPrevu
        $module2 = Module::create([
            'code_module' => 'M102',
            'libelle_module' => 'Bases de Données',
            'code_filiere' => $filiere->code_filiere,
            'regional' => 'N',
            'status' => 'en cours',
            'nbh_p_s1' => 20,
            'nbh_sync_s1' => 5,
            'nbh_async_s1' => 5,
            'nbh_total_s1' => 30,
            'nbh_p_s2' => 20,
            'nbh_sync_s2' => 5,
            'nbh_async_s2' => 5,
            'nbh_total_s2' => 30,
            'nbh_p_total' => 40,
            'nbh_sync_total' => 10,
            'nbh_async_total' => 10,
            'nbh_total_global' => 60,
            'semestre' => 'année'
        ]);

        $groupe3 = Groupe::create([
            'code_filiere' => $filiere->code_filiere,
            'code_groupe' => 'GRP3',
            'effectif' => 25,
            'annee_formation' => 2024,
            'status_groupe' => 'actif',
            'mode' => 'présentiel',
            'creneau' => 'soir'
        ]);

        DB::table('groupe_formateur_module')->insert([
            'code_module' => $module2->code_module,
            'code_filiere' => $filiere->code_filiere,
            'matricule' => $formateur->matricule,
            'code_groupe' => $groupe3->code_groupe,
            'nbh_par_semaine_p' => 3,
            'nbh_par_semaine_sync' => 1,
            'nbh_par_semaine_total' => 4,
            'nbhp_realisee' => 0,
            'nbhsync_realisee' => 0,
            'nbh_total_realisee' => 0,
            'prec_nbhp_realisee' => 0,
            'prec_nbhsync_realisee' => 0,
            'prec_nbh_total_realisee' => 0,
            'taux_total_realisee' => 0,
            'nbcc_realisee' => 0,
            'efm_realise' => 'non',
            'debut_module' => Carbon::now()->toDateString(),
            'fin_module' => null,
            'date_efm_prevu' => null,
            'date_efm_reelle' => null,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
} 