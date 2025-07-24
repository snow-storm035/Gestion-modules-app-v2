<?php

namespace App\Http\Controllers;

use App\Models\Avancement;
use App\Models\Filiere;
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Module;
use Illuminate\Http\Request;
use App\Services\ExcelServices;
use Carbon\Carbon;
use Error;
use Exception;
use Mockery\Undefined;

use function PHPUnit\Framework\isNull;
use function PHPUnit\Framework\returnSelf;

class AvancementController extends Controller
{

    public function makeAlert()
    {

        // display an alert
        // good : if the nbh/sem is sufficient
        //    --> this means : between start and end dates the number of hours after this period will
        // reach the total amount in the end 
        // bad : if not


        $modules = Module::all();
        // $modules = Module::orderBy('debut_module')->get();

        $modules_stats = [];
        foreach ($modules as $m) {

            if ($m['debut_module'] !== null) {

                // dd($m['code_module'], $m['code_filiere']);

                $dateDebut = Carbon::parse($m['debut_module']);

                $dateEfm = Carbon::parse($m['date_efm_prevu']);

                // différence entre les dates en semaines :
                $nbsemaines = floor($dateDebut->diffInWeeks($dateEfm));

                // $module = array_map(function($groupe) use($m){
                //     $a = [...$groupe['pivot']];
                //     // dd($a);
                //     // dd($groupe);
                //     if($groupe['pivot']['code_filiere'] === $m['code_filiere'] && $groupe['pivot']['code_module'] === $m['code_module']){
                //         return [
                //             'code_filiere' => $a['code_filiere'],
                //             'code_module' => $a['code_module'],
                //             'nbh_par_semaine' => $a['nbh_par_semaine_realisee']
                //         ];
                //     }
                // },$m->groupes->where('code_filiere',$m['code_filiere'])->toArray());

                $module = $m->groupes->where('code_filiere', $m['code_filiere'])
                    ->firstOrFail() // this will raise a NOT FOUND ERROR !!!
                    ->toArray()['pivot'];

                // dd($m->groupes->where('code_filiere',$m['code_filiere'])->first()->toArray()['pivot']);
                $taux_total = $module['nbh_par_semaine_realisee'] * $nbsemaines;

                // dd($taux_total, $m['nbh_p_total'] + $m['nbh_sync_total'], $m['nbh_total_global']);
                if ($taux_total >= $m['nbh_p_total'] + $m['nbh_sync_total']) {
                    $module['willcompleteontime'] = true;
                } else {
                    $module['willcompleteontime'] = false;
                }

                $modules_stats[] = $module;

                // dd(gettype($module), $module);
                // dd(gettype($dateDebut),gettype($dateEfm),$dateDebut, $diffWeeks, gettype($diffWeeks));
            }
        }
        // this comontier
        // dd($modules_stats);
    }


    // public function majDates


    public function changerNbHeuresParSemaine(Request $request)
    {
        // dd("1234567890-");
        // dd($request['avancement']['code_module']);

        $codeModule = $request['avancement']['code_module'];
        $codeGroupe = $request['avancement']['code_groupe'];
        $codeFormateur = $request['avancement']['matricule'];

        // dd($codeModule, $codeGroupe, $codeFormateur);

        // $avancement = $request->has('avancement') ?
        //     Avancement::findWithCompositeKey([
        //         ['code_module','=',$codeModule],
        //         ['code_groupe','=',$codeGroupe],
        //         ['matricule','=',$codeFormateur]
        //     ])
        //     : null;

        $avancement = $request->has('avancement') ?
            Avancement::where('code_module', $codeModule)
            ->where('code_groupe', $codeGroupe)
            ->where('matricule', $codeFormateur)
            ->first()
            : null;

        // dd($avancement);



        if ($request->has('nbh_par_semaine') && $avancement) {

            Avancement::updateWithCompositeKey([
                ['code_module', '=', $codeModule],
                ['code_groupe', '=', $codeGroupe],
                ['matricule', '=', $codeFormateur],
            ], ['nbh_par_semaine_total' => $request['nbh_par_semaine']]);

            // $avancement->update([
            //     'nbh_par_semaine_realisee' => $request['nbh_par_semaine']
            // ]);


            // $avancement['nbh_par_semaine_realisee'] = $request['nbh_par_semaine'];

            // $avancement->save();


            // code to review changes :
            $avancement = Avancement::where('code_module', $codeModule)
                ->where('code_groupe', $codeGroupe)
                ->where('matricule', $codeFormateur)
                ->first();


            // dd($avancement['nbh_par_semaine_total']);
            // ###################################################

            return response()->json(['success' => 'data has been updated successfully'], 200);
        } else {
            return response()->json(['error' => 'all fields are required'], 400);
        }
    }

    public function calculerTauxAvancement(Request $request)
    {

        $avancements = Avancement::all();

        // $a = Module::firstOrFail();
        // dd($a['nbh_p_total']);

        // dd($avancements);
        // foreach($avancements as $avancement){
        //     dd($avancement['code_module']);
        // }

        $taux_realisation = array_map(function ($item) {

            $module = Module::where('code_module', $item['code_module'])->firstOrFail();
            // $module = $item->module;
            // dd($module['nbh_p_total']);


            return [

                'code_module' => $item['code_module'],
                'matricule' => $item['matricule'],
                'code_groupe' => $item['code_groupe'],
                'total_realise' => $item['nbh_total_realisee'],
                'total_heures' => $module['nbh_total_global'],
                'taux_presentiel_realise' => $module['nbh_p_total']  != 0 ? ($item['nbhp_realisee'] / $module['nbh_p_total']) * 100 : 0,
                'taux_sync_realise' => $module['nbh_sync_total'] != 0 ? ($item['nbhsync_realisee'] / $module['nbh_sync_total']) * 100 : 0,
                'taux_total_realise' => $module['nbh_total_global'] != 0 ? ($item['nbh_total_realisee'] / ($module['nbh_p_total'] + $module['nbh_sync_total'])) * 100 : 0,

            ];
        }, [...$avancements]);

        // dd($taux_realisation);

    }




    /**
     * Display a listing of the resource.
     */
    //     public function index(Request $request)

    //     {
    //         //
    //         // $data = ExcelServices::convertExcelToJson($request);
    // return "sdfghjkl;";
    //         global $avancements;

    //         // filiere filter
    //         $filieres = array_map(function ($item) {
    //             // dd($item);
    //             return [
    //                 'code_filiere' => $item['code_filiere'],
    //                 'libelle' => $item['nom_filiere']
    //             ];
    //         },
    //          Filiere::all()->toArray());

    //         // groupe filter
    //         $filiere = null;

    //         // dd($request);
    //         if ($request->has('filiere')) {
    //             $filiere = Filiere::where('code_filiere', $request->input('filiere'))->first();

    //             $avancements = Avancement::where('code_filiere',$filiere['code_filiere']);
    //             // dd("here");
    //             // dd($filiere->groupes()->get());
    //         }

    //         $groupes = array_map(function ($item) {
    //             return [
    //                 'code_groupe' => $item['code_groupe'],
    //                 // 'libelle' => $item['nom_filiere']
    //             ];
    //         }, $filiere ? $filiere->groupes()->get()->toArray() : Groupe::all()->toArray());
    //         // dd($groupes);

    //         // module filter :
    //         $modules = array_map(function ($item) {
    //             return [
    //                 'code' => [$item['code_filiere'], $item['code_module']],
    //                 'libelle' => $item['libelle_module']
    //             ];
    //         }, $filiere ? $filiere->modules()->get()->toArray() : Module::all()->toArray());
    //         // dd($modules);


    //         // annee formation filter :

    //         $annees = array_map(function ($item) {
    //             return $item['annee_formation'];
    //         }, Groupe::orderBy('annee_formation')->get()->toArray());
    //         $annees_unique = array_unique($annees, SORT_REGULAR);
    //         // dd($annees_unique);

    //         // niveau filter :
    //         $niveaux = array_map(function ($item) {
    //             return $item['niveau'];
    //         }, Filiere::orderBy('niveau')->get()->toArray());
    //         $niveaux_unique = array_unique($niveaux, SORT_REGULAR);
    //         dd($niveaux_unique);
    //         // filtering logic :
    //         // 
    //         // dd($avancements);
    //         // dd()
    //         // foreach ($avancements as $a) {
    //         //     dd($a);
    //         // }

    //         $avancements = Avancement::paginate(10);



    //         return response()->json([
    //             "avancements" => $avancements,
    //             "filters" => [
    //                 'filieres' => $filieres,
    //                 'groupes' => $groupes,
    //                 'modules' => $modules,
    //                 'annees_formation' => $annees_unique,
    //                 'niveaux' => $niveaux_unique,
    //             ]
    //         ],200);
    //     }

    public function index(Request $request)
    {
        // return "1234567890-";
        // Initialize base query
        $avancementsQuery = Avancement::all();

        $avancements_toSend = array_map(function ($a) {

            $module = Module::where('code_module', $a['code_module'])->where('code_filiere', $a['code_filiere'])->first();
            $formateur = Formateur::where('matricule', $a['matricule'])->first();
            $filiere = Filiere::where('code_filiere', $a['code_filiere'])->first();
            $groupe = Groupe::where('code_groupe', $a['code_groupe'])->first();

            return [
                ...$a,

                'niveau' => $filiere['niveau'],
                'nom_formateur' => $formateur['nom_formateur'],
                'semestre' => $module['semestre'],
                'annee_formation' => $groupe['annee_formation']
            ];
        }, $avancementsQuery->toArray());

        // foreach ($avancements_toSend as $a) {
        //     $module = Module::where('code_module', $a['code_module'])->where('code_filiere', $a['code_filiere'])->first();
        //     $formateur = Formateur::where('matricule', $a['matricule'])->first();
        //     $filiere = Filiere::where('code_filiere', $a['code_filiere'])->first();
        //     $groupe = Groupe::where('code_groupe', $a['code_groupe'])->first();

        //     $a['niveau'] = $filiere['niveau'];
        //     $a['nom_formateur'] = $formateur['nom_formateur'];
        //     $a['semestre'] = $module['semestre'];
        //     $a['annee_formation'] = $groupe['annee_formation'];

        //     dd($a);
        // }


        $filiere = null;

        // Filiere filter
        if ($request->has('filiere')) {
            $filiere = Filiere::where('code_filiere', $request->input('filiere'))->first();
            if ($filiere) {
                $avancementsQuery->where('code_filiere', $filiere->code_filiere);
            }
        }

        // Get filters data
        $filieres = Filiere::all()->map(function ($item) {
            return [
                'code_filiere' => $item->code_filiere,
                'libelle' => $item->nom_filiere
            ];
        })->toArray();

        $groupes = $filiere
            ? $filiere->groupes->map(function ($groupe) {
                return ['code_groupe' => $groupe->code_groupe];
            })->toArray()
            : Groupe::all()->map(function ($groupe) {
                return ['code_groupe' => $groupe->code_groupe];
            })->toArray();

        $modules = $filiere
            ? $filiere->modules->map(function ($module) {
                return [
                    'code' => [$module->code_filiere, $module->code_module],
                    'libelle' => $module->libelle_module
                ];
            })->toArray()
            : Module::all()->map(function ($module) {
                return [
                    'code' => [$module->code_filiere, $module->code_module],
                    'libelle' => $module->libelle_module
                ];
            })->toArray();

        $formateurs = Formateur::select('matricule', 'nom_formateur')->distinct()->get()->toArray();
        // dd($formateurs);

        $annees_unique = Groupe::distinct()->orderBy('annee_formation')->pluck('annee_formation');
        $niveaux_unique = Filiere::distinct()->orderBy('niveau')->pluck('niveau');
        $semestres = Module::distinct()->orderBy('semestre')->pluck('semestre');


        // Paginate results
        // $avancements = $avancementsQuery->get();
        // dd($avancements_toSend);
        return response()->json([
            "avancements" => $avancements_toSend, // an error might happen
            "filters" => [
                'filieres' => $filieres,
                'groupes' => $groupes,
                'modules' => $modules,
                'annees_formation' => $annees_unique,
                'niveaux' => $niveaux_unique,
                'formateurs' => $formateurs,
                'semestres' => $semestres
            ]
        ], 200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        if ($request->has('excelfile')) {
            $jsonData = ExcelServices::convertExcelToJson($request);

            $data = json_decode($jsonData, true);

            // dd($data);

            $avancements = array_map(function ($item) {

                $correspondant = Avancement::findWithCompositeKey([
                    ['matricule', '=', $item['code_formateur_p_actif']],
                    ['code_groupe', '=', $item['code_groupe']],
                    // ['code_filiere','=',$item['code_filiere']],
                    ['code_module', '=', $item['code_module']]
                ]);

                // dd($correspondant);

                if ($correspondant) {

                    if ($item['nbh_realisee_global'] > 0 && $correspondant['debut_module'] === null) {
                        $date_debut = Carbon::now()->toDateString();
                        // dd($item['date_debut'],$item);
                    }

                    $module = Module::where([
                        ['code_module', '=', $correspondant['code_module']],
                        ['code_filiere', '=', $correspondant['code_filiere']]
                    ])->first();

                    // dd($module);
                    if ($module) {
                        $total = $module['nbh_p_total'] + $module['nbh_sync_total'];
                    }

                    // dd($total);
                    // dd(isModuleHoursCompleted($correspondant['nbh_total_realisee'], $total ));

                    //verify if a groupe has completed the module's HOURS and that we have a start date('date_debut'):
                    if (!isModuleHoursCompleted($correspondant['nbh_total_realisee'], $total) && $correspondant['debut_module'] !== null) {
                        $nbh_par_semaine = $item['nbh_realisee_p'] - $correspondant['nbhp_realisee'];

                        // calculer la date fin prévu :
                        $dateFin = calculerDateFinModule($total, $nbh_par_semaine, $correspondant['debut_module']);
                        // dd($nbh_par_semaine,$correspondant);
                        // dd($dateFin->toDateString());
                    }
                    // else{
                    //     dd('did not enter if condition');
                    // }
                }
                // dd($correspondant['nbh_par_semaine']);

                return [
                    'code_module' => $item['code_module'],
                    'code_filiere' => $item['code_filiere'],
                    'code_groupe' => $item['code_groupe'],
                    'matricule' => $item['code_formateur_p_actif'] !== "" ? $item['code_formateur_p_actif'] : "none",
                    // 'matricule' => $item['code_formateur_p_actif'] ? $item['code_formateur_p_actif'] : "none" ,
                    // 'code_formateur_sync' => $item['code_formateur_sync_actif'],

                    'nbhp_realisee' => (float) $item['nbh_realisee_p'],
                    'nbhsync_realisee' => (float) $item['nbh_realisee_sync'],
                    'nbh_total_realisee' => (float) $item['nbh_realisee_global'],

                    // maybe should reset to 0 :
                    'nbh_par_semaine' => isset($nbh_par_semaine) ? $nbh_par_semaine : ($correspondant ? $correspondant['nbh_par_semaine'] : 0),

                    'nbcc_realisee' => (int) $item['nbcc'],

                    'efm_realise' => $item['validation_efm'],

                    'debut_module' => isset($date_debut) ? $date_debut : null,

                    'fin_module' => isset($dateFin) ? $dateFin->toDateString() : null
                ];
                // echo print_r($correspondant['nbh_par_semaine']);
            }, $data);

            // dd($avancements);
            $avancements_unique = array_unique($avancements, SORT_REGULAR);

            // dd($avancements_unique);

            foreach ($avancements_unique as $avancement) {
                if ($avancement !== null) {
                    // Avancement::firstOrCreate($avancement);
                    Avancement::updateOrCreate([
                        ['code_module', '=', $avancement['code_module']],
                        ['code_groupe', '=', $avancement['code_groupe']],
                        ['matricule', '=', $avancement['matricule']],
                        ['code_filiere', '=', $avancement['code_filiere']]
                    ], $avancement);
                    // dd('error rise here');
                }
            }

            return response()->json(['success' => 'avancement updated successfully']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $groupe, string $module, Request $request)
    {
        //
        // dd($groupe, $module);


        // dd($recommandedMh);
        $avancement = Avancement::where([
            ['code_groupe', $groupe],
            ['code_module', $module]
        ])->first();

        $isModuleEnRetard = moduleEnRetard(mhrestante($avancement), $avancement);
        $recommandedMh = ($isModuleEnRetard) ?
            proposerNbHeuresParSemaines(Carbon::parse($avancement->date_efm_reelle), mhrestante($avancement))
            : 0;

        // dd($recommandedMh,proposerNbHeuresParSemaines(Carbon::parse($avancement->date_efm_reelle), mhrestante($avancement)),moduleEnRetard(mhrestante($avancement), $avancement));

        $module = Module::where('code_module', $avancement->code_module)
            ->where('code_filiere', $avancement->code_filiere)
            ->first();
        $filiere = Filiere::where('code_filiere', $avancement->code_filiere)
            ->first();
        // dd($module, $filiere, $avancement->code_filiere);
        return response()->json([
            'avancement' => [
                ...$avancement->toArray(),
                "nom_module" => $module['libelle_module'],
                "nom_filiere" => $filiere['nom_filiere']
            ],
            'recommandation' => $recommandedMh
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Avancement $avancement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Avancement $avancement)
    {
        // need testing
        // dd($request);
        try {
            global $new_nbh_par_semaine_total;
            $validated = $request->validate([
                'nbhparsemainetotal' => 'required|numeric|min:0'
            ]);

            $min_nbhparsemaine = proposerNbHeuresParSemaines(Carbon::parse($avancement['date_efm_prevu']), mhrestante($avancement));

            if ($min_nbhparsemaine === null || $min_nbhparsemaine === 0) {
                throw new Exception('Impossible de calculer la recommandation : la date EFM est passée ou invalide.');
            }

            if ($validated) {
                $new_nbh_par_semaine_total = $request->input('nbhparsemainetotal');
            } else {
                throw new Exception('valeur non valide');
            }
            // dd($new_nbh_par_semaine_total);
            // $enretard = moduleEnRetard(mhrestante($avancement), $avancement, $new_nbh_par_semaine_total);
            // dd($enretard);
            if ($new_nbh_par_semaine_total < $min_nbhparsemaine) {
                throw new Exception('valeur insuffisante pour finir en temps');
            }
            $avancement->update(['nbh_par_semaine_total' => $new_nbh_par_semaine_total]);
            // $updated = Avancement::find($avancement->id);
            return response()->json(['success' => 'updating was successfull !'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'failed to update : ' . $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Avancement $avancement)
    {
        //
    }
}
