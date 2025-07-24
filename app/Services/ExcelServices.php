<?php

namespace App\Services;

use Error;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Exception;

class ExcelServices {

    const FILE_HEADERS = [
        "date_maj",
        "annee",
        "niveau",
        "secteur",
        "code_filiere",
        "filiere",
        "type_formation",
        "creneau",

        "code_groupe",
        "effectif_groupe",
        "sous_groupe",
        "status_sousgroupe",
        "fusion_groupe",
        "code_fusion",
        "annee_formation",
        "mode",

        "code_module",
        "module",
        "regional",

        "code_formateur_p_actif",
        "formateur_p",
        "code_formateur_sync_actif",
        "formateur_sync",

        "nbh_p_s1",
        "nbh_sync_s1",
        "nbh_async_s1",
        "nbh_total_s1",

        "nbh_p_s2",
        "nbh_sync_s2",
        "nbh_async_s2",
        "nbh_total_s2",

        "nbh_p_total",
        "nbh_sync_total",
        "nbh_async_total",
        "nbh_total_global",

        "nbh_affectee_p",
        "nbh_affectee_sync",
        "nbh_affectee_global",
        
        "nbh_realisee_p",
        "nbh_realisee_sync",
        "nbh_realisee_global",

        "taux_realisation_p",
        "taux_realisation_sync",
        "taux_realisation_global",

        "moy_absence",
        "nbcc",
        "seance_efm",
        "validation_efm",
        "classe_teams",
        "module_pie",
        "efp_pie"
    ];

    const DATES_HEADERS = [
        "code_filiere",
        "code_module",
        "code_groupe",
        "matricule",
        "debut_module",
        "fin_module"
    ];


    public static function convertExcelToJson(Request $request) {

        try{          
            $path = $request->file('excelfile');
            $spreadsheet = IOFactory::load($path);
            
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();
            
            $jsonData = [];

            array_shift($data);
            if($request->input('type') === "avancements"){
                foreach ($data as $row) {
                    // dd(count(ExcelServices::FILE_HEADERS));
                    $jsonData[] = array_combine(ExcelServices::FILE_HEADERS, $row);
                }
            }else if($request->input('type') === "dates_modules"){
                foreach ($data as $row) {
                    // dd(count(ExcelServices::FILE_HEADERS));
                    $jsonData[] = array_combine(ExcelServices::DATES_HEADERS, $row);
                }
            }
            $json = json_encode($jsonData);
            // dd($jsonData);
            return $json;
        }catch(Exception $e){
            throw new Error($e->getMessage());
            // return response()->json(["error" => "failed to convert excel file"]);
        }   
    }

    // public static function datesDebutExcelToJson(Request $request)
    // {
    //     try{
    //         $path = $request->file('excelfile');
    //         $spreadsheet = IOFactory::load($path);
            
    //         $sheet = $spreadsheet->getActiveSheet();
    //         $data = $sheet->toArray();

    //         $jsonData = [];

    //         array_shift($data);

    //     }catch(Exception $e){
    //         return $e->getMessage();
    //     }
    // }
}