/**
 * Archivo para depurar la funcionalidad de edición de máquinas
 */
$(document).ready(function() {
    console.log('Script de depuración cargado');
    
    // Log inicial
    console.log('Comprobando elementos:');
    console.log('- Modal editar:', $('#modalEditarMaquina').length);
    console.log('- Botón editar:', $('.btn-editar-maquina').length);
    console.log('- Contenedor operarios:', $('#operarios-asignados').length);
    
    // Reasignar evento click para asegurarse
    $('.btn-editar-maquina').click(function() {
        const id = $(this).data('id');
        const nombre = $(this).data('nombre');
        
        console.log('Click en editar máquina:', id, nombre);
        
        $('#editar_maquina_id').val(id);
        $('#editar_nombre').val(nombre);
        
        // Prueba de carga de operarios
        $.ajax({
            url: `/maquinas/${id}/operarios`,
            type: 'GET',
            success: function(data) {
                console.log('Datos de operarios recibidos:', data);
                
                // Mostrar operarios en consola
                const operarios = data.operarios || [];
                console.log('Operarios asignados:', operarios);
                
                // Actualizar vista
                actualizarVistaOperarios(operarios);
            },
            error: function(xhr) {
                console.error('Error al cargar operarios:', xhr);
            }
        });
        
        $('#modalEditarMaquina').modal('show');
    });
    
    function actualizarVistaOperarios(operarios) {
        const contenedor = $('#operarios-asignados');
        contenedor.empty();
        
        if (operarios.length === 0) {
            contenedor.html('<p class="text-muted">No hay operarios asignados</p>');
            return;
        }
        
        let html = '<ul class="list-group">';
        operarios.forEach(op => {
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${op.nombre}
                    <button type="button" class="btn btn-sm btn-danger btn-quitar-operario" data-id="${op.id}">
                        <i class="fas fa-times"></i> Quitar
                    </button>
                </li>
            `;
        });
        html += '</ul>';
        
        contenedor.html(html);
    }
});
