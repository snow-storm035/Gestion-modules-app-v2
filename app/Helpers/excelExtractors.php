<?php

use App\Models\Filiere;
use App\Models\Formateur;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Avancement;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

// Helper: Validate required keys in an array
function validateKeys(array $item, array $requiredKeys) {
    foreach ($requiredKeys as $key) {
        if (!array_key_exists($key, $item) || $item[$key] === null || $item[$key] === '') {
            throw new \InvalidArgumentException("Missing or empty required key: $key");
        }
    }
}

if (!function_exists('getFilieres')) {
    function getFilieres($data)
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                try {
                    validateKeys($item, ['code_filiere', 'filiere', 'type_formation', 'niveau', 'secteur']);
                    $filiere = [
                        'code_filiere' => $item['code_filiere'],
                        'nom_filiere' => $item['filiere'],
                        'type_formation' => $item['type_formation'],
                        'niveau' => $item['niveau'],
                        'secteur' => $item['secteur']
                    ];
                    Filiere::updateOrCreate($filiere);
                } catch (\Exception $e) {
                    // Log or handle error as needed
                    continue;
                }
            }
        });
    }
}

if (!function_exists('getFormateurs')) {
    function getFormateurs($data)
    {
        DB::transaction(function () use ($data) {
            $formateurs = [];
            foreach ($data as $item) {
                try {
                    if (!empty($item['code_formateur_p_actif']) && !empty($item['formateur_p'])) {
                        $formateurs[] = [
                            'matricule' => $item['code_formateur_p_actif'],
                            'nom_formateur' => $item['formateur_p']
                        ];
                    }
                    if (!empty($item['code_formateur_sync_actif']) && !empty($item['formateur_sync'])) {
                        $formateurs[] = [
                            'matricule' => $item['code_formateur_sync_actif'],
                            'nom_formateur' => $item['formateur_sync']
                        ];
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }
            $formateurs_unique = array_unique($formateurs, SORT_REGULAR);
            foreach ($formateurs_unique as $formateur) {
                try {
                    validateKeys($formateur, ['matricule', 'nom_formateur']);
                    Formateur::updateOrCreate($formateur);
                } catch (\Exception $e) {
                    continue;
                }
            }
        });
    }
}

if (!function_exists('getGroupes')) {
    function getGroupes($data)
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                try {
                    validateKeys($item, ['code_filiere', 'code_groupe', 'effectif_groupe', 'annee_formation', 'status_sousgroupe', 'mode', 'creneau']);
                    $groupe = [
                        'code_filiere' => $item['code_filiere'],
                        'code_groupe' => $item['code_groupe'],
                        'effectif' => $item['effectif_groupe'],
                        'annee_formation' => $item['annee_formation'],
                        'status_groupe' => $item['status_sousgroupe'],
                        'mode' => $item['mode'],
                        'creneau' => $item['creneau']
                    ];
                    Groupe::updateOrCreate([
                        'code_groupe' => $groupe['code_groupe'],
                        'code_filiere' => $groupe['code_filiere']], $groupe);
                } catch (\Exception $e) {
                    continue;
                }
            }
        });
    }
}

if (!function_exists('getModules')) {
    function getModules($data)
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                try {
                    validateKeys($item, ['code_filiere', 'code_module', 'module', 'regional',
                        'nbh_p_s1', 'nbh_sync_s1', 'nbh_async_s1', 'nbh_total_s1',
                        'nbh_p_s2', 'nbh_sync_s2', 'nbh_async_s2', 'nbh_total_s2',
                        'nbh_p_total', 'nbh_sync_total', 'nbh_async_total', 'nbh_total_global']);
                    $module = [
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
                        'semestre' => ($item['nbh_total_s1'] != 0 && $item['nbh_total_s2'] != 0) ? "année" : (($item['nbh_total_s2'] == 0) ? "s1" : "s2")
                    ];
                    Module::updateOrCreate([
                        'code_module' => $module['code_module'],
                        'code_filiere' => $module['code_filiere']
                    ], $module);
                } catch (\Exception $e) {
                    continue;
                }
            }
        });
    }
}

if (!function_exists('getAvancements')) {
    function getAvancements($data)
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                try {
                    validateKeys($item, ['code_module', 'code_filiere', 'code_groupe', 'code_formateur_p_actif', 'nbh_realisee_p', 'nbh_realisee_sync', 'nbh_realisee_global', 'nbcc', 'validation_efm']);
                    $matricule = $item['code_formateur_p_actif'] !== "" ? $item['code_formateur_p_actif'] : null;
                    if (!$matricule) continue; // skip if no formateur
                    $avancement = [
                        'code_module' => $item['code_module'],
                        'code_filiere' => $item['code_filiere'],
                        'code_groupe' => $item['code_groupe'],
                        'matricule' => $matricule,
                        'nbhp_realisee' => (float) $item['nbh_realisee_p'],
                        'nbhsync_realisee' => (float) $item['nbh_realisee_sync'],
                        'nbh_total_realisee' => (float) $item['nbh_realisee_global'],
                        'prec_nbhp_realisee' => 0, // Could be improved if previous data is available
                        'prec_nbhsync_realisee' => 0,
                        'prec_nbh_total_realisee' => 0,
                        'nbh_par_semaine_p' => 0,
                        'nbh_par_semaine_sync' => 0,
                        'nbh_par_semaine_total' => 0,
                        'nbcc_realisee' => (int) $item['nbcc'],
                        'efm_realise' => (string) $item['validation_efm'],
                        'debut_module' => isset($item['debut_module']) ? (string) $item['debut_module'] : null,
                        'fin_module' => isset($item['fin_module']) ? (string) $item['fin_module'] : null
                    ];
                    Avancement::updateOrCreate([
                        'code_module' => $avancement['code_module'],
                        'code_filiere' => $avancement['code_filiere'],
                        'code_groupe' => $avancement['code_groupe'],
                        'matricule' => $avancement['matricule']
                    ], $avancement);
                } catch (\Exception $e) {
                    continue;
                }
            }
            updateTauxAvancement();
            synchroniserAlerts();
        });
    }
}

if (!function_exists('updateDatesFromFile')) {
    function updateDatesFromFile($data)
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                try {
                    validateKeys($item, ['code_filiere', 'code_module', 'matricule', 'code_groupe', 'debut_module', 'fin_module']);
                    $record = Avancement::findWithCompositeKey([
                        ['code_module', '=', $item['code_module']],
                        ['matricule', '=', $item['matricule']],
                        ['code_groupe', '=', $item['code_groupe']],
                    ]);
                    Avancement::where([
                        ['code_module', '=', $item['code_module']],
                        ['matricule', '=', $item['matricule']],
                        ['code_groupe', '=', $item['code_groupe']],
                    ])->update([
                        'debut_module' => $record['debut_module'] ? $record['debut_module'] : $item['debut_module'],
                        'date_efm_prevu' => $record['date_efm_prevu'] ? $record['date_efm_prevu'] : Carbon::parse($item['fin_module'])->toDateString(),
                    ]);
                } catch (\Exception $e) {
                    continue;
                }
            }
        });
    }
}
