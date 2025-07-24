<?php

namespace App\Http\Controllers;

use App\Models\Formateur;
use App\Services\ExcelServices;
use Exception;
use Illuminate\Http\Request;

class FormateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $formateurs = Formateur::all();

        return response()->json(["formateurs" => $formateurs],200);
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
    
            $formateurs_presentiel = array_map(function($item){
                if($item['code_formateur_p_actif'] && $item['formateur_p'] && $item){
                    return [
                        "matricule" => $item['code_formateur_p_actif'],
                        "nom_formateur" => $item['formateur_p']
                    ];
                }
            },$data);
            
            // dd(gettype($formateurs_presentiel));
    
            $formateurs_sync = array_map(function($item){
                if($item['code_formateur_sync_actif'] && $item['formateur_sync'] && $item){
                    return [
                        "matricule" => $item['code_formateur_sync_actif'],
                        "nom_formateur" => $item['formateur_sync']
                    ];
                }
            },$data);
    
            $fp_notnull =  array_filter($formateurs_presentiel, function($item){
                return $item !== null;
            });
            $fsync_notnull =  array_filter($formateurs_sync, function($item){
                return $item !== null;
            });
    
            $formateurs = array_merge($fp_notnull, $fsync_notnull);
    
            $formateurs_unique = array_unique($formateurs, SORT_REGULAR);
            // dd($formateurs_unique);
            
            Formateur::firstOrCreate([
                'matricule' => 'none',
                'nom_formateur' => 'none' 
            ]);

            foreach($formateurs_unique as $formateur){
                Formateur::firstOrCreate($formateur);
            }
        }else{
            // $codeFormateur = $request->input('matricule');
            // $nomFormateur = $request->input('nom_formateur');
            // $codeFormateur = $request->input('matricule');

            $newFormateur = $request->validate([
                'matricule' => 'bail|required',
                'nom_formateur' => 'bail|required|alpha'
            ]);

            if($newFormateur){
                Formateur::create($newFormateur);
                return response()->json(['success' => 'formateur a été bien ajouté']);
            }else{
                return response()->json(['error' => 'all fields are required']);
            }
        }
       

        return response()->json(["success" => "inserted successfully"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Formateur $formateur)
    {
        //
        // $formateur = Formateur::find($id);

        // $formateur = Formateur::where('matricule', $id)->get();
        // dd($formateur);

        if($formateur){
            return response()->json(['formateur' => $formateur],200);
        }

        return response()->json(['error' => 'formateur non trouvé'],404);

        // dd($id);


    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formateur $formateur)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formateur $formateur)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formateur $formateur)
    {
        //
        try{
            dd($formateur);
            $formateur->delete();
            return response()->json(['success' => 'data has been removed successfully']);
        }catch(Exception $e){
            return response()->json(['error' => $e->getMessage()],404);
        }

        
    }
}
