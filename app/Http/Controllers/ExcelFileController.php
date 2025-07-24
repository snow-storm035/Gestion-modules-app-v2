<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Module;
use App\Services\ExcelServices;
use Exception;
use Illuminate\Http\Request;

class ExcelFileController extends Controller
{
    //

    public function extractAllData(Request $request)
    {
        try{
        // dd($request);
        if ($request->has('excelfile')) {
            $jsonData = ExcelServices::convertExcelToJson($request);

            $data = json_decode($jsonData, true);
            // dd($data);
            if ($request->input('type') === "avancements") {

                // $filieres = Filiere::first();
                // $formateurs = Formateur::first();
                // $groupes = Groupe::first();
                // $modules = Module::first();
                // dd(!$filieres && !$formateurs && !$groupes && !$modules);
                // dd($filieres ,$formateurs ,$groupes ,$modules);

                // if (!$filieres || !$formateurs || !$groupes || !$modules) //checking if there is data before running these functions
                // {
                    getFilieres($data);
                    getFormateurs($data);
                    getGroupes($data);
                    getModules($data);
                // }
                // else{
                //     // throw new Exception('must fill other tables too');
                // }
                getAvancements($data);
                // dd("before the storm");
                return response()->json(['success' => 'operation completed'], 200);

            } else if ($request->input('type') === 'dates_modules') {
                // dd('hi');
                updateDatesFromFile($data);

                return response()->json(['success' => 'les dates sont mis à jour avec succèss'],200);
            }
        }
        }catch(Exception $e){
            return response()->json(['error' => $e->getMessage()],500);
        }
    }
}
