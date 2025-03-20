// ...existing code...

/**
 * Los operarios asignados a esta máquina.
 */
public function operarios()
{
    return $this->belongsToMany(User::class, 'maquina_operario', 'maquina_id', 'user_id');
}

// ...existing code...
