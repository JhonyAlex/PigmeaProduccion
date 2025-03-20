<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Maquina;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class MaquinaController extends Controller
{
    /**
     * Obtener todas las máquinas ordenadas por nombre
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $maquinas = Maquina::orderBy('nombre')->get();
            return response()->json([
                'success' => true, 
                'maquinas' => $maquinas
            ]);
        } catch (QueryException $e) {
            Log::error('Error en la consulta de máquinas: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al obtener las máquinas',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error inesperado al obtener máquinas: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Guardar una nueva máquina en el sistema
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255|unique:maquinas,nombre',
            ], [
                'nombre.required' => 'El nombre de la máquina es obligatorio',
                'nombre.unique' => 'Ya existe una máquina con ese nombre',
                'nombre.max' => 'El nombre no puede exceder los 255 caracteres'
            ]);
            
            $maquina = new Maquina();
            $maquina->nombre = trim($request->nombre);
            $maquina->save();
            
            return response()->json([
                'success' => true, 
                'message' => 'Máquina creada correctamente', 
                'maquina' => $maquina
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            Log::error('Error al crear máquina (DB): ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al crear la máquina',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error inesperado al crear máquina: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una máquina del sistema
     * Libera las relaciones con operarios antes de eliminarla
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'El ID de la máquina debe ser un número'
                ], 400);
            }

            $maquina = Maquina::findOrFail($id);
            
            // Comprobar si hay registros relacionados que no se pueden eliminar
            // (Añadir aquí las comprobaciones necesarias según el modelo de datos)
            
            // Eliminar relaciones primero
            if (method_exists($maquina, 'operarios')) {
                $maquina->operarios()->detach();
            }
            
            $maquina->delete();
            
            return response()->json([
                'success' => true, 
                'message' => 'Máquina eliminada correctamente'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'La máquina no existe'
            ], 404);
        } catch (QueryException $e) {
            // Captura error de restricción de clave foránea
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false, 
                    'message' => 'No se puede eliminar esta máquina porque está siendo utilizada en registros existentes'
                ], 409);
            }
            
            Log::error('Error al eliminar máquina (DB): ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al eliminar la máquina',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error inesperado al eliminar máquina: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obtiene los operarios asignados a una máquina específica
     *
     * @param int $id ID de la máquina
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOperarios($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'El ID de la máquina debe ser un número'
                ], 400);
            }

            $maquina = Maquina::findOrFail($id);
            
            if (!method_exists($maquina, 'operarios')) {
                return response()->json([
                    'success' => false,
                    'message' => 'La relación entre máquinas y operarios no está definida'
                ], 500);
            }
            
            $operarios = $maquina->operarios()->select('users.id', 'users.name as nombre')->get();
            
            return response()->json([
                'success' => true,
                'operarios' => $operarios
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'La máquina no existe'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener operarios de máquina: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al obtener los operarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene los operarios disponibles para asignar a una máquina específica
     *
     * @param int $id ID de la máquina
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOperariosDisponibles($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'El ID de la máquina debe ser un número'
                ], 400);
            }

            $maquina = Maquina::findOrFail($id);
            
            if (!method_exists($maquina, 'operarios')) {
                return response()->json([
                    'success' => false,
                    'message' => 'La relación entre máquinas y operarios no está definida'
                ], 500);
            }
            
            // Obtener los IDs de operarios ya asignados
            $operariosAsignados = $maquina->operarios()->pluck('users.id')->toArray();
            
            // Obtener todos los operarios que no están asignados a esta máquina
            $operariosDisponibles = User::whereHas('roles', function($q) {
                    $q->where('name', 'operario');
                })
                ->whereNotIn('id', $operariosAsignados)
                ->select('id', 'name as nombre')
                ->orderBy('nombre')
                ->get();
            
            return response()->json([
                'success' => true,
                'operarios' => $operariosDisponibles
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'La máquina no existe'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener operarios disponibles: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al obtener los operarios disponibles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualiza la información de una máquina existente
     * Permite actualizar el nombre y/o los operarios asignados
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id ID de la máquina a actualizar
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'El ID de la máquina debe ser un número'
                ], 400);
            }

            $maquina = Maquina::findOrFail($id);
            
            $request->validate([
                'nombre' => 'required|string|max:255|unique:maquinas,nombre,' . $id,
                'operarios' => 'sometimes|array',
                'operarios.*' => 'integer|exists:users,id'
            ], [
                'nombre.required' => 'El nombre de la máquina es obligatorio',
                'nombre.unique' => 'Ya existe otra máquina con ese nombre',
                'operarios.array' => 'El formato de operarios no es válido',
                'operarios.*.exists' => 'Uno o más operarios seleccionados no existen'
            ]);
            
            $maquina->nombre = trim($request->nombre);
            $maquina->save();
            
            // Actualizar asignaciones de operarios si el método existe
            if ($request->has('operarios') && method_exists($maquina, 'operarios')) {
                $maquina->operarios()->sync($request->operarios);
            }
            
            return response()->json([
                'success' => true, 
                'message' => 'Máquina actualizada correctamente',
                'maquina' => $maquina
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'La máquina no existe'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            Log::error('Error al actualizar máquina (DB): ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al actualizar la máquina',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error inesperado al actualizar máquina: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
