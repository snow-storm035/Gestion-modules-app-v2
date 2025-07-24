<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Services\ExcelServices;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    // dd("model conttroler ");
        if($request->has('excelfile')){
            $jsonData = ExcelServices::convertExcelToJson($request);
            
            $data = json_decode($jsonData, true);
    
            // dd($data);
    
            $modules = array_map(function($item){
                return [
                    'code_filiere' => $item['code_filiere'],
                    'code_module' => $item['code_module'],
                    'libelle_module' => $item['module'],
                    'regional' => $item['regional'],

                    'nbh_p_s1' => (float) $item['nbh_p_s1'],
                    'nbh_sync_s1' => (float) $item['nbh_sync_s1'],
                    'nbh_async_s1' => (float) $item['nbh_async_s1'],
                    'nbh_total_s1' => (float) $item['nbh_total_s1'],

                    'nbh_p_s2' => (float) $item['nbh_p_s2'],
                    'nbh_sync_s2' => (float) $item['nbh_sync_s2'],
                    'nbh_async_s2' => (float) $item['nbh_async_s2'],
                    'nbh_total_s2' => (float) $item['nbh_total_s2'],

                    'nbh_p_total' => (float) $item['nbh_p_total'],
                    'nbh_sync_total' => (float) $item['nbh_sync_total'],
                    'nbh_async_total' => (float) $item['nbh_async_total'],
                    'nbh_total_global' => (float) $item['nbh_total_global'],
                ];
            },$data);

            $modules_unique = array_unique($modules, SORT_REGULAR);

            // dd($modules_unique);

            foreach($modules_unique as $module){
                Module::create($module);
            }
        }
        return response()->json(["success" => "inserted successfully"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        //
    }
}
