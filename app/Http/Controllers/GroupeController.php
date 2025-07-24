<?php

namespace App\Http\Controllers;

use App\Models\Avancement;
use App\Models\Groupe;
use App\Services\ExcelServices;
use Exception;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // $groupes = Groupe::all();

    }

    public function nbrgroupes(){
        try{
            $nbrgroupes = count(Groupe::all()->toArray());
            return response()->json(['nbrgroupes' => $nbrgroupes],200);
        }catch(Exception $e){
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
        if($request->has('excelfile')){
            $jsonData = ExcelServices::convertExcelToJson($request);
    
            
            $data = json_decode($jsonData, true);
    
    
            // dd($data);
    
            $groupes = array_map(function($item){
                return [
                    'code_filiere' => $item['code_filiere'],
                    'code_groupe' => $item['code_groupe'],
                    'niveau' => $item['niveau'],
                    'effectif' => $item['effectif_groupe'],
                    'annee_formation' => $item['annee_formation'],
                    'status_groupe' => $item['status_sousgroupe'],
                    'mode' => $item['mode'],
                    'creneau' => $item['creneau']
                ];
            },$data);

            $groupes_unique = array_unique($groupes, SORT_REGULAR);

            foreach($groupes_unique as $groupe){
                Groupe::create($groupe);
            }

            return response()->json(['success' => 'groupes inserted successfully']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Groupe $groupe, Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Groupe $groupe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Groupe $groupe)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Groupe $groupe)
    {
        //
    }
}
