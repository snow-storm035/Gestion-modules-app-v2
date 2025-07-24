<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Groupe extends Model
{
    /** @use HasFactory<\Database\Factories\GroupeFactory> */
    use HasFactory;


    protected $fillable = [
        "code_filiere",
        "code_groupe",
        // "niveau",
        "effectif",
        "annee_formation",
        "status_groupe",
        "mode",
        "creneau"
    ];


    protected $primaryKey = "code_groupe";
    public $incrementing = false;
    protected $keyType = 'string';


    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'groupe_formateur_module', 'code_groupe', 'code_module')
            ->withPivot(
                'matricule',
                'code_filiere',
                'nbh_par_semaine_p',
                'nbh_par_semaine_sync',
                'nbh_par_semaine_total',
                'nbhp_realisee',
                'nbhsync_realisee',
                'nbh_total_realisee',
                'taux_total_realisee',
                'prec_nbhp_realisee',
                'prec_nbhsync_realisee',
                'prec_nbh_total_realisee',
                'nbcc_realisee',
                'efm_realise',
                'debut_module',
                'fin_module'
            )
            ->withTimestamps();
    }

    public function formateurs(): BelongsToMany
    {
        return $this->belongsToMany(Formateur::class, 'groupe_formateur_module', 'code_groupe', 'matricule')
            ->withPivot(
                'code_module',
                'code_filiere',
                'nbh_par_semaine_p',
                'nbh_par_semaine_sync',
                'nbh_par_semaine_total',
                'nbhp_realisee',
                'nbhsync_realisee',
                'nbh_total_realisee',
                'taux_total_realisee',
                'prec_nbhp_realisee',
                'prec_nbhsync_realisee',
                'prec_nbh_total_realisee',
                'nbcc_realisee',
                'efm_realise',
                'debut_module',
                'fin_module'
            )
            ->withTimestamps();
    }
}
