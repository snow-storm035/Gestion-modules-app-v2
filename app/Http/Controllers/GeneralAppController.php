<?php

namespace App\Http\Controllers;

use App\Models\Avancement;
use App\Models\Filiere;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Formateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralAppController extends Controller
{
    //
    public function getAuthUser(){
        return response()->json(Auth::user(),200);
    }
    public function calendrierEfms(Request $request)
    {
        // dd("1234567890-sdfghjkl");
        // dd($request->route('regional'));
        if ($request->has('brief')) {
            $modules = Module::where('regional', 'O')
                ->get();
            //  dd($modules);
            // $modules_codes = array_map(function($item){
            //     return $item['code_modules'];
            // },$modules->toArray());

            // first code 
            $calendrier_regional = [];
            foreach ($modules as $module) {
                $calendrier_regional[] = Avancement::select('code_filiere', 'code_module', 'date_efm_prevu')
                    ->where('code_module', $module['code_module'])
                    ->where('code_filiere', $module['code_filiere'])
                    ->where('date_efm_prevu', '<>', null)
                    ->groupBy('code_filiere', 'code_module', 'date_efm_prevu')
                    ->orderBy('date_efm_prevu', 'desc')
                    ->first();
                // dd($calendrier_regional, $module);
            }
            // dd("`1234567890-");
            $calendrier_regional_clean = array_filter($calendrier_regional, function ($item) {
                return $item !== null;
            });





            // dd($calendrier_regional);

            // dd(count($modules->toArray()));
            return response()->json(['calendrierBref' => $calendrier_regional_clean], 200);
            // dd($avancements);
        } else {

            // send filters :

            // filieres
            $filieres = array_map(function ($item) {
                // dd($item);
                return [
                    'code_filiere' => $item['code_filiere'],
                    'libelle' => $item['nom_filiere']
                ];
            }, Filiere::all()->toArray());
            // annee formation filter :

            $annees = array_map(function ($item) {
                return $item['annee_formation'];
            }, Groupe::orderBy('annee_formation')->get()->toArray());
            $annees_unique = array_unique($annees, SORT_REGULAR);
            // dd($annees_unique);

            // niveau filter :
            $niveaux = array_map(function ($item) {
                return $item['niveau'];
            }, Filiere::orderBy('niveau')->get()->toArray());
            $niveaux_unique = array_unique($niveaux, SORT_REGULAR);


            $avancements = Avancement::all();
            // dd($avancements);
            $calendrier = array_map(function ($item) {
                $filiere = Filiere::where('code_filiere', $item['code_filiere'])
                    ->first();
                $groupe = Groupe::where('code_filiere',$item['code_filiere'])
                    ->where('code_groupe',$item['code_groupe'])
                    ->first();
                $regional = Module::where('code_filiere', $item['code_filiere'])
                    ->where('code_module', $item['code_module'])
                    ->first()->regional;
                return [
                    "code_filiere" => $item['code_filiere'],
                    "code_groupe" => $item['code_groupe'],
                    "code_module" => $item['code_module'],
                    "regional" => $regional,
                    "annee_formation" => $groupe['annee_formation'],
                    "niveau" => $filiere['niveau'],
                    "date_efm_prevu" => $item['date_efm_prevu'],
                    "date_efm_reelle" => $item['date_efm_reelle'],
                ];
            }, $avancements->toArray());
        //    dd("11234567890");
            return response()->json([
                'calendrierEfms' => $calendrier,
                'filters' => [
                    'filieres' => $filieres,
                    'annees_formation' => $annees_unique,
                    'niveaux' => $niveaux_unique,
                ]

            ], 200);
        }
    }






    public function etatsModules()
    {
        $avancements = Avancement::all();

        // filiere filter
        $filieres = array_map(function ($item) {
     
            return [
                'code_filiere' => $item['code_filiere'],
                'libelle' => $item['nom_filiere']
            ];
        }, Filiere::all()->toArray());

        // groupe filter
        $filiere = null;

    
        // if ($request->has('filiere')) {
        //     $filiere = Filiere::where('code_filiere', $request->input('filiere'))->first();

        //     $avancements = Avancement::where('code_filiere', $filiere['code_filiere']);
        //     // dd("here");
        //     // dd($filiere->groupes()->get());
        // }

        $groupes = array_map(function ($item) {
            return [
                'code_groupe' => $item['code_groupe'],
                // 'libelle' => $item['nom_filiere']
            ];
        }, $filiere ? $filiere->groupes()->get()->toArray() : Groupe::all()->toArray());
 

        // module filter :
        $modules = array_map(function ($item) {
            return [
                'code' => [$item['code_filiere'], $item['code_module']],
                'libelle' => $item['libelle_module']
            ];
        }, $filiere ? $filiere->modules()->get()->toArray() : Module::all()->toArray());



        $avancementsStats = array_map(function ($item) {
            $module = Module::where('code_module', $item['code_module'])
                ->where('code_filiere', $item['code_filiere'])
                ->with('filiere')
                ->first();
            // dd(gettype($item));
            // dd([
            //     'code_groupe' => $item['code_groupe'],
            //     'code_module' => $item['code_module'],
            //     'libelle_module' => $module['libelle_module'],
            //     'regional' => $module['regional'] === "O" ? "oui" : "non",
            //     'etat' => getModuleState($item, $module),
            // ]);
            return [
                'code_filiere' => $item['code_filiere'],
                'nom_filiere' => $module->filiere->nom_filiere,
                'code_groupe' => $item['code_groupe'],
                'code_module' => $item['code_module'],
                'libelle_module' => $module['libelle_module'],
                'regional' => $module['regional'] === "O" ? "oui" : "non",
                'etat' => getModuleState($item, $module),
            ];
        }, $avancements->toArray());

        // dd("1234567890");
        // dd($avancementsStats);

        return response()->json([
            'modulesstats' => $avancementsStats,
            'filters' => [
                'filieres' => $filieres,
                'groupes' => $groupes,
                'modules' => $modules,
                'regional' => ['oui', 'non']
            ]
        ], 200);
    }

    public function truncateCustomTables()
    {
        $tables = [
            'alerts',
            'groupe_formateur_module',
            'effs',
            'modules',
            'groupes',
            'formateurs',
            'filieres',
            'notifications'
        ];
    
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            foreach ($tables as $table) {
                DB::statement("TRUNCATE TABLE `$table`;");
            }
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return response()->json(['message' => 'Custom tables truncated successfully.'], 200);
        } catch (\Exception $e) {
            Log::error('Truncate error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
    

    public function checkProgressState(){
        verifierAvancements();
    }
}