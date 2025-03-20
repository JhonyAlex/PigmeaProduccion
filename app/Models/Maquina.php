<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maquina extends Model
{
    use HasFactory;
    
    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = ['nombre'];
    
    /**
     * Los operarios asignados a esta máquina.
     */
    public function operarios()
    {
        return $this->belongsToMany(User::class, 'maquina_operario', 'maquina_id', 'user_id');
    }
}
