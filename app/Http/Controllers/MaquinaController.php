// ...existing code...

/**
 * Obtiene los operarios asignados a una máquina.
 *
 * @param int $id
 * @return \Illuminate\Http\JsonResponse
 */
public function getOperarios($id)
{
    $maquina = Maquina::findOrFail($id);
    $operarios = $maquina->operarios()->select('id', 'name as nombre')->get();
    
    return response()->json(['operarios' => $operarios]);
}

/**
 * Obtiene los operarios disponibles para asignar a una máquina.
 *
 * @param int $id
 * @return \Illuminate\Http\JsonResponse
 */
public function getOperariosDisponibles($id)
{
    $maquina = Maquina::findOrFail($id);
    
    // Obtener los IDs de operarios ya asignados
    $operariosAsignados = $maquina->operarios()->pluck('users.id')->toArray();
    
    // Obtener todos los operarios que no están asignados a esta máquina
    $operariosDisponibles = User::whereHas('roles', function($q) {
            $q->where('name', 'operario');
        })
        ->whereNotIn('id', $operariosAsignados)
        ->select('id', 'name as nombre')
        ->get();
    
    return response()->json(['operarios' => $operariosDisponibles]);
}

/**
 * Actualiza la máquina especificada en el almacenamiento.
 *
 * @param \Illuminate\Http\Request $request
 * @param int $id
 * @return \Illuminate\Http\JsonResponse
 */
public function update(Request $request, $id)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'operarios' => 'sometimes|array',
        'operarios.*' => 'integer|exists:users,id'
    ]);

    $maquina = Maquina::findOrFail($id);
    $maquina->nombre = $request->nombre;
    $maquina->save();
    
    // Actualizar asignaciones de operarios
    if ($request->has('operarios')) {
        $maquina->operarios()->sync($request->operarios);
    }
    
    return response()->json(['success' => true, 'message' => 'Máquina actualizada correctamente']);
}

// ...existing code...
