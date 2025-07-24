<?php

use Carbon\Carbon;
use App\Models\Alert;
use App\Models\Avancement;
use App\Models\User;
use App\Notifications\ModuleEnRetard;
use App\Notifications\ModulePrequeFini;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

// Alert state constants
const ALERT_STATE_LATE = 'en retard';
const ALERT_STATE_ALMOST_DONE = 'presque fini';

if (!function_exists('moduleEnRetard')) {
    /**
     * Check if a module is late and return the predicted end date if so.
     */
    function moduleEnRetard(float $mhrestante, Avancement $avancement, float $new_nbhparsemaine = 0)
    {
        $main_nbhparsemaine = $new_nbhparsemaine != 0 ? $new_nbhparsemaine : $avancement['nbh_par_semaine_total'];
        if ($main_nbhparsemaine != 0) {
            $nbrSemaines = ceil($mhrestante / $main_nbhparsemaine);
            $dateFinPrevu = Carbon::now()->addWeeks($nbrSemaines);
            $dates_gape = $dateFinPrevu->diffInDays(Carbon::parse($avancement['date_efm_prevu']));
            if ($dates_gape < 0) {
                return $dateFinPrevu->toDateString(); // Module is late
            }
        }
        return false;
    }
}

if (!function_exists('modulePresqueFinis')) {
    /**
     * Check if a module is almost finished.
     */
    function modulePresqueFinis(float $mhrestante, Avancement $avancement)
    {
        if (function_exists('calculerTauxAvancement') && calculerTauxAvancement($avancement) > 90 && strtolower($avancement['efm_realise']) === "non") {
            return true;
        }
        return false;
    }
}

if (!function_exists('verifierAvancements')) {
    /**
     * Loop through all Avancements and create alerts/notifications as needed.
     * Note: For large datasets, consider chunking/batching for performance.
     */
    function verifierAvancements()
    {
        try {
            $avancements = Avancement::all();
            foreach ($avancements as $avancement) {
                try {
                    // Validate required fields
                    if (!isset($avancement['code_filiere'], $avancement['code_module'], $avancement['code_groupe'], $avancement['id'])) {
                        continue;
                    }
                    $mhrestante = function_exists('mhrestante') ? mhrestante($avancement) : null;
                    if ($mhrestante === null) continue;

                    // Check for late module
                    $lateDate = moduleEnRetard($mhrestante, $avancement);
                    if ($lateDate) {
                        $alert = Alert::updateOrCreate([
                            "avancement_id" => $avancement['id'],
                            "code_filiere" => $avancement['code_filiere'],
                            "code_module" => $avancement['code_module'],
                            "code_groupe" => $avancement['code_groupe'],
                        ],
                        [
                            "avancement_id" => $avancement['id'],
                            "code_filiere" => $avancement['code_filiere'],
                            "code_module" => $avancement['code_module'],
                            "code_groupe" => $avancement['code_groupe'],
                            "etat" => ALERT_STATE_LATE,
                            "mhrestante" => $mhrestante,
                            "date_fin_prevu" => $lateDate
                        ]);
                        if ($alert->wasRecentlyCreated) {
                            $user = Auth::user();
                            if ($user) {
                                try {
                                    $user->notify(new ModuleEnRetard($avancement));
                                } catch (\Exception $e) {
                                    Log::error('Notification error (ModuleEnRetard): ' . $e->getMessage());
                                }
                            }
                        }
                    } else if (modulePresqueFinis($mhrestante, $avancement)) {
                        $alert = Alert::updateOrCreate(
                            [
                                "avancement_id" => $avancement['id'],
                                "code_filiere" => $avancement['code_filiere'],
                                "code_module" => $avancement['code_module'],
                                "code_groupe" => $avancement['code_groupe'],
                            ],
                            [
                                "avancement_id" => $avancement['id'],
                                "code_filiere" => $avancement['code_filiere'],
                                "code_module" => $avancement['code_module'],
                                "code_groupe" => $avancement['code_groupe'],
                                "date_fin_prevu" => $avancement['fin_module'],
                                "etat" => ALERT_STATE_ALMOST_DONE,
                                "mhrestante" => $mhrestante,
                            ]
                        );
                        if ($alert->wasRecentlyCreated) {
                            $user = Auth::user();
                            if ($user) {
                                try {
                                    $user->notify(new ModulePrequeFini($avancement));
                                } catch (\Exception $e) {
                                    Log::error('Notification error (ModulePrequeFini): ' . $e->getMessage());
                                }
                            }
                        }
                    } else {
                        continue;
                    }
                } catch (\Exception $e) {
                    Log::error('Error processing avancement: ' . $e->getMessage());
                    continue;
                }
            }
        } catch (\Exception $e) {
            Log::error('verifierAvancements failed: ' . $e->getMessage());
        }
    }
}

if (!function_exists('synchroniserAlerts')) {
    /**
     * Loop through all Avancements, create/update alerts, and delete obsolete alerts.
     * This function ensures that the alerts table is a reflection of the current state.
     * Note: For large datasets, consider chunking/batching for performance.
     */
    function synchroniserAlerts()
    {
        try {
            // Consider using chunking for large numbers of records to conserve memory
            Avancement::chunk(200, function ($avancements) {
                foreach ($avancements as $avancement) {
                    try {
                        // Validate required fields
                        if (!isset($avancement['code_filiere'], $avancement['code_module'], $avancement['code_groupe'], $avancement['id'])) {
                            continue;
                        }
                        $mhrestante = function_exists('mhrestante') ? mhrestante($avancement) : null;
                        if ($mhrestante === null) continue;

                        // Check for late module
                        $lateDate = moduleEnRetard($mhrestante, $avancement);
                        if ($lateDate !== false) {
                            $alert = Alert::updateOrCreate([
                                "avancement_id" => $avancement['id'],
                                "code_filiere" => $avancement['code_filiere'],
                                "code_module" => $avancement['code_module'],
                                "code_groupe" => $avancement['code_groupe'],
                            ],
                            [
                                "avancement_id" => $avancement['id'],
                                "code_filiere" => $avancement['code_filiere'],
                                "code_module" => $avancement['code_module'],
                                "code_groupe" => $avancement['code_groupe'],
                                "etat" => ALERT_STATE_LATE,
                                "mhrestante" => $mhrestante,
                                "date_fin_prevu" => $lateDate
                            ]);
                            if ($alert->wasRecentlyCreated) {
                                $user = Auth::user(); // Note: Auth::user() may be null in background jobs
                                if ($user) {
                                    try {
                                        $user->notify(new ModuleEnRetard($avancement));
                                    } catch (\Exception $e) {
                                        Log::error('Notification error (ModuleEnRetard): ' . $e->getMessage());
                                    }
                                }
                            }
                        } else if (modulePresqueFinis($mhrestante, $avancement)) {
                            $alert = Alert::updateOrCreate(
                                [
                                    "avancement_id" => $avancement['id'],
                                    "code_filiere" => $avancement['code_filiere'],
                                    "code_module" => $avancement['code_module'],
                                    "code_groupe" => $avancement['code_groupe'],
                                ],
                                [
                                    "avancement_id" => $avancement['id'],
                                    "code_filiere" => $avancement['code_filiere'],
                                    "code_module" => $avancement['code_module'],
                                    "code_groupe" => $avancement['code_groupe'],
                                    "date_fin_prevu" => $avancement['fin_module'],
                                    "etat" => ALERT_STATE_ALMOST_DONE,
                                    "mhrestante" => $mhrestante,
                                ]
                            );
                            if ($alert->wasRecentlyCreated) {
                                $user = Auth::user(); // Note: Auth::user() may be null in background jobs
                                if ($user) {
                                    try {
                                        $user->notify(new ModulePrequeFini($avancement));
                                    } catch (\Exception $e) {
                                        Log::error('Notification error (ModulePrequeFini): ' . $e->getMessage());
                                    }
                                }
                            }
                        } else {
                            // If no alert condition is met, delete any existing alert for this avancement.
                            Alert::where("avancement_id", $avancement['id'])->delete();
                        }
                    } catch (\Exception $e) {
                        Log::error('Error processing avancement ' . $avancement['id'] . ': ' . $e->getMessage());
                        continue;
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('synchroniserAlerts failed: ' . $e->getMessage());
        }
    }
}
