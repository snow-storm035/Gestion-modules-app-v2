<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Formateur extends Model
{
    /** @use HasFactory<\Database\Factories\FormateurFactory> */
    use HasFactory;

    protected $fillable = ['matricule', 'nom_formateur'];


    protected $primaryKey = "matricule";
    public $incrementing = false;
    protected $keyType = 'string';

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'groupe_formateur_module', 'matricule', 'code_module')
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
        return $this->belongsToMany(Groupe::class, 'groupe_formateur_module', 'matricule', 'code_groupe')
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
