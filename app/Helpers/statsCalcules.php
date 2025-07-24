<?php

use App\Models\Avancement;
use App\Models\Filiere;
use App\Models\Module;
use Illuminate\Database\Eloquent\Collection;

if (!function_exists('calculerTauxAvancement')) {
    function calculerTauxAvancement(Avancement $avancement)
    {
        // (mhtotal / mhrealisee) * 100 = tt %
        $module = Module::where([
            ['code_module', '=', $avancement['code_module']],
            ['code_filiere', '=', $avancement['code_filiere']]
        ])->first();
        // dd($avancement['nbh_total_realisee'] / $module['nbh_total_global'], $module,$avancement);
        return ($avancement['nbh_total_realisee'] / $module['nbh_total_global']) * 100;
    }
}

// masse horaire restante
if (!function_exists('mhrestante')) {
    function mhrestante(Avancement $avancement)
    {
        // mhtotal - mhrealisee
        $module = Module::where([
            ['code_module', '=', $avancement['code_module']],
            ['code_filiere', '=', $avancement['code_filiere']]
        ])->first();
        return $module['nbh_total_global'] - $avancement['nbh_total_realisee'];
    }
}


if (!function_exists('calculerTauxMoyenFiliere')) {
    function calculerTauxMoyenFiliere(Filiere $filiere)
    {
        // tous les modules pour une filière:
        $modules = $filiere->modules()->get();
        // dd($modules);

        // les avancements de tous les groupes dans chaque module
        $all = [];
        foreach ($modules as $m) {
            $all[] = [
                $m->code_module => Avancement::where([
                    ['code_filiere', '=', $filiere->code_filiere],
                    ['code_module', '=', $m->code_module]
                ])->get()
            ];
        }

        $avancements_filiere = [];

        foreach ($all as $a) {
            foreach ($a as $key => $item) {
                global $taux;
                $taux = array_map(function ($avancement) {
                    return calculerTauxAvancement($avancement);
                }, [...$item]);
                if (count($taux) > 0) {
                    $moyenne = array_sum($taux) / count($taux);
                } else {
                    $moyenne = 0;
                }
                // dd($moyenne);
                $avancements_filiere[] = [
                    "code_filiere" => $filiere['code_filiere'],
                    "code_module" => $key,
                    "module" => Module::where('code_module', $key)
                        ->where('code_filiere', $filiere['code_filiere'])
                        ->first()
                        ->libelle_module,
                    "taux_avancement" => $moyenne
                ];
            }
        }

        // dd($avancements_filiere);
        return $avancements_filiere;
    }
}


if (!function_exists('verifierEtatModule')) {
    function verifierEtatModule(Avancement $avancement)
    {
        // if($avancement['nbh_total_realisee'])
        return;
    }
}



if (!function_exists('updateTauxAvancement')) {
    function updateTauxAvancement()
    {
        $avancements = Avancement::all();
        foreach ($avancements as $avancement) {

            $taux = number_format(calculerTauxAvancement($avancement), 2);
            global $dateEfmPrevu;
            if ($avancement->debut_module) {
                $module = Module::where('code_module', $avancement->code_module)
                    ->where('code_filiere', $avancement->code_filiere)
                    ->first();
                $mh_total = $module->nbh_p_total + $module->nbh_sync_total;
                $dateEfmPrevu = calculerDateEFMPrevu($mh_total, $avancement->nbh_par_semaine_total, $avancement->debut_module);
            }
            $avancement->update(['taux_total_realisee' => $taux, 'date_efm_prevu' => $dateEfmPrevu]);
        }
    }
}

if (!function_exists('getModuleState')) {
    function getModuleState(array $avancement, Module $module)
    {
        if ($avancement['nbh_total_realisee'] >= $module['nbh_total_global'] && $avancement['efm_realise'] === "oui") {
            return "achevé";
        } else if ($avancement['nbh_total_realisee'] >= $module['nbh_total_global']) {
            return "masse horaire terminée";
        } else if ($avancement['nbh_total_realisee'] > 0) {
            return "en cours";
        } else {
            return "pas encore commencé";
        }
    }
}


// if(!function_exists('nbhParSemaineRecommandee')){

//     function nbhParSemaineRecommandee()
//     {

//     }
// }