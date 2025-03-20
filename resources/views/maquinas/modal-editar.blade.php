<div class="modal fade" id="modalEditarMaquina" tabindex="-1" role="dialog" aria-labelledby="modalEditarMaquinaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEditarMaquinaLabel">Editar Máquina</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formEditarMaquina">
                    @csrf
                    <input type="hidden" id="editar_maquina_id" name="maquina_id">
                    <div class="form-group">
                        <label for="editar_nombre">Nombre de la Máquina</label>
                        <input type="text" class="form-control" id="editar_nombre" name="nombre" required>
                    </div>

                    <!-- Nueva sección para operarios -->
                    <div class="form-group">
                        <label>Operarios Asignados</label>
                        <div id="operarios-asignados" class="mb-2">
                            <!-- Aquí se cargarán los operarios asignados dinámicamente -->
                        </div>
                        <button type="button" class="btn btn-sm btn-primary" id="btn-agregar-operario">
                            <i class="fas fa-plus"></i> Agregar Operario
                        </button>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal para seleccionar operario -->
<div class="modal fade" id="modalSeleccionarOperario" tabindex="-1" role="dialog" aria-labelledby="modalSeleccionarOperarioLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalSeleccionarOperarioLabel">Seleccionar Operario</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <select class="form-control" id="select-operario">
                        <!-- Opciones se cargarán dinámicamente -->
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btn-confirmar-operario">Agregar</button>
            </div>
        </div>
    </div>
</div>
