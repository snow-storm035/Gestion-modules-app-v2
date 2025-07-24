<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Module extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleFactory> */
    use HasFactory;

    protected $primaryKey = "code_module";
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "code_module",
        "libelle_module",
        "code_filiere",
        "regional",
        "status",

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
        "semestre"
    ];

    public function filiere() {
        return $this->belongsTo(Filiere::class,'code_filiere','code_filiere');
    }
    public function formateurs(): BelongsToMany
    {
        return $this->belongsToMany(Formateur::class, 'groupe_formateur_module', 'code_module', 'matricule')
            ->withPivot(
                'code_groupe',
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

    public function groupes(): BelongsToMany
    {
        return $this->belongsToMany(Groupe::class, 'groupe_formateur_module', 'code_module', 'code_groupe')
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
}
