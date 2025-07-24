<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Filiere extends Model
{
    /** @use HasFactory<\Database\Factories\FiliereFactory> */
    use HasFactory;

    protected $fillable = ["code_filiere","nom_filiere","niveau","type_formation","secteur"];

    protected $primaryKey = "code_filiere";
    public $incrementing = false;
    protected $keyType = 'string';

    public function groupes() : HasMany
    {
        return $this->hasMany(Groupe::class, 'code_filiere', 'code_filiere');
    }
    public function modules() : HasMany
    {
        return $this->hasMany(Module::class, 'code_filiere', 'code_filiere');
    }



}
