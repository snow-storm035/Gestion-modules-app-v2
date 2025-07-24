<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    /** @use HasFactory<\Database\Factories\AlertFactory> */
    use HasFactory;
    protected $fillable = ['avancement_id','code_module','code_groupe','code_filiere','date_fin_prevu','etat','mhrestante'];



    
}
