<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Maquina;
use App\Models\User;

class MaquinaController extends Controller
{
    /**
     * Obtener todas las máquinas
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $maquinas = Maquina::orderBy('nombre')->get();
            return response()->json(['maquinas' => $maquinas]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener máquinas: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Guardar una nueva máquina
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:maquinas,nombre',
        ]);
        
        try {
            $maquina = new Maquina();
            $maquina->nombre = $request->nombre;
            $maquina->save();
            
            return response()->json(['success' => true, 'message' => 'Máquina creada correctamente', 'maquina' => $maquina]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear máquina: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar una máquina
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $maquina = Maquina::findOrFail($id);
            
            // Eliminar relaciones primero (opcional, dependiendo de tus restricciones de clave foránea)
            $maquina->operarios()->detach();
            
            $maquina->delete();
            
            return response()->json(['success' => true, 'message' => 'Máquina eliminada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar máquina: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Obtiene los operarios asignados a una máquina.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOperarios($id)
    {
        try {
            $maquina = Maquina::findOrFail($id);
            $operarios = $maquina->operarios()->select('users.id', 'users.name as nombre')->get();
            
            return response()->json(['operarios' => $operarios]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener operarios: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene los operarios disponibles para asignar a una máquina.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOperariosDisponibles($id)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener operarios disponibles: ' . $e->getMessage()], 500);
        }
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
}
