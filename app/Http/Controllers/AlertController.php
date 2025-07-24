<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Filiere;
use App\Models\Module;
use Exception;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $type = $request->has('type_alert') ? $request->input('type_alert') : null;

        $alerts = $type ? Alert::where('etat', $type)->get() : Alert::all();

        $displayedAlerts = array_map(function($item){
            $module = Module::where([
                ['code_filiere','=',$item['code_filiere']],
                ['code_module','=',$item['code_module']]
            ])->first();

            $niveau = Filiere::where('code_filiere',$item['code_filiere'])->first()->niveau;

            return [...$item,'regional' => $module['regional'], 'niveau' => $niveau];
        },$alerts->toArray());

        // dd($alerts);

        // filiere filter
        $filieres = array_map(function ($item) {
            // dd($item);
            return [
                'code_filiere' => $item['code_filiere'],
                'libelle' => $item['nom_filiere']
            ];
        }, Filiere::all()->toArray());

        // niveau filter :
        $niveaux = array_map(function ($item) {
            return $item['niveau'];
        }, Filiere::orderBy('niveau')->get()->toArray());
        $niveaux_unique = array_unique($niveaux, SORT_REGULAR);

        $etats = ['presque fini', 'en retard'];
        // dd($etats);
        return response()->json([
            'alerts' => $displayedAlerts,
            'filters' => [
                'filieres' => $filieres,
                'niveaux' => $niveaux_unique,
                'regional' => ['O', 'N'],
                'etats' => $etats
            ]
        ], 200);
    }

    public function alertsCount(Request $request)
    {
        try {
            global $alerts_count;
            if ($request->has('alert_type') && ($request->input('alert_type') === "enretard" || $request->input('alert_type') === "presquefinie")) {
                if ($request->input('alert_type') === "enretard") {
                    $alerts_count = count(Alert::where('etat', 'en retard')->get()->toArray());
                } else {
                    $alerts_count = count(Alert::where('etat', 'presque fini')->get()->toArray());
                }
                return response()->json(['alerts_count' => $alerts_count], 200);
            } else {
                throw new Exception("alert type wasn't specified or invalid");
            }
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
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
    }

    /**
     * Display the specified resource.
     */
    public function show(Alert $alert)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Alert $alert)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alert $alert)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alert $alert)
    {
        //
    }
}
