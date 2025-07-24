<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Avancement extends Model
{
    /** @use HasFactory<\Database\Factories\AvancementFactory> */
    use HasFactory;


    protected $table = "groupe_formateur_module";


    // protected $primaryKey = ['code_module', 'matricule', 'code_groupe'];
    // public $incrementing = false;
    // protected $keyType = 'string';


    protected $fillable = [
        'code_module',
        'code_filiere',
        'matricule',
        'code_groupe',
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
    ];

    // protected $casts = [
    //     'debut_module' => 'date',
    //     'fin_module' => 'date' // good if you're passing strings
    // ];
    
    // 'nbh_par_semaine_realisee',
    public function getKeyName()
    {
        // dd($this->primaryKey);
        try{
            return $this->primaryKey;
        }catch(Exception $e){
            return $e->getMessage();
        }
    }


    public static function findWithCompositeKey(array $query)
    {
        // try{
        return Avancement::where($query)
            ->first();
        // return DB::table('groupe_formateur_module')
        //     ->where($query)
        //     ->get();

        // }catch(Exception $e){
        //     return null;
        // }
    }

    public static function updateWithCompositeKey(array $query, array $options)
    {
        DB::table('groupe_formateur_module')
            ->where($query)
            ->update($options);
    }

    public function alerts(){
        $this->hasMany(Avancement::class, 'avancement_id', 'avancement_id');
    }

    // public static function createOrUpdate(Array $query, Array $options){
    //     $item = Avancement::find();
    //     if(true){
    //         // update
    //         // Avancement::
    //     }else{
    //         // create
    //     }
    // }
}
