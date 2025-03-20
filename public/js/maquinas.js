// ...existing code...

// Variable para almacenar los operarios actuales
let operariosAsignados = [];

$(document).on('click', '.btn-editar-maquina', function() {
    const maquinaId = $(this).data('id');
    const nombre = $(this).data('nombre');
    
    $('#editar_maquina_id').val(maquinaId);
    $('#editar_nombre').val(nombre);
    
    // Cargar operarios asignados
    cargarOperariosAsignados(maquinaId);
    
    $('#modalEditarMaquina').modal('show');
});

function cargarOperariosAsignados(maquinaId) {
    $.ajax({
        url: `/maquinas/${maquinaId}/operarios`,
        type: 'GET',
        success: function(response) {
            operariosAsignados = response.operarios;
            actualizarListaOperarios();
        },
        error: function(xhr) {
            console.error('Error al cargar operarios:', xhr.responseText);
        }
    });
}

function actualizarListaOperarios() {
    const contenedor = $('#operarios-asignados');
    contenedor.empty();
    
    if (operariosAsignados.length === 0) {
        contenedor.append('<p class="text-muted">No hay operarios asignados</p>');
        return;
    }
    
    const lista = $('<ul class="list-group"></ul>');
    
    operariosAsignados.forEach(operario => {
        lista.append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${operario.nombre}
                <button type="button" class="btn btn-sm btn-danger btn-quitar-operario" data-id="${operario.id}">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `);
    });
    
    contenedor.append(lista);
}

// Agregar operario
$(document).on('click', '#btn-agregar-operario', function() {
    cargarOperariosDisponibles();
    $('#modalSeleccionarOperario').modal('show');
});

function cargarOperariosDisponibles() {
    const maquinaId = $('#editar_maquina_id').val();
    $.ajax({
        url: `/maquinas/operarios-disponibles/${maquinaId}`,
        type: 'GET',
        success: function(response) {
            const select = $('#select-operario');
            select.empty();
            
            if (response.operarios.length === 0) {
                select.append('<option value="">No hay operarios disponibles</option>');
                $('#btn-confirmar-operario').prop('disabled', true);
                return;
            }
            
            $('#btn-confirmar-operario').prop('disabled', false);
            response.operarios.forEach(operario => {
                select.append(`<option value="${operario.id}">${operario.nombre}</option>`);
            });
        },
        error: function(xhr) {
            console.error('Error al cargar operarios disponibles:', xhr.responseText);
        }
    });
}

// Confirmar agregar operario
$(document).on('click', '#btn-confirmar-operario', function() {
    const operarioId = $('#select-operario').val();
    const operarioNombre = $('#select-operario option:selected').text();
    const maquinaId = $('#editar_maquina_id').val();
    
    if (!operarioId) return;
    
    // Agregar temporalmente a la lista
    operariosAsignados.push({
        id: operarioId,
        nombre: operarioNombre
    });
    
    actualizarListaOperarios();
    $('#modalSeleccionarOperario').modal('hide');
});

// Quitar operario
$(document).on('click', '.btn-quitar-operario', function() {
    const operarioId = $(this).data('id');
    operariosAsignados = operariosAsignados.filter(op => op.id != operarioId);
    actualizarListaOperarios();
});

// Modificar el submit del formulario para incluir operarios
$('#formEditarMaquina').on('submit', function(e) {
    e.preventDefault();
    
    const maquinaId = $('#editar_maquina_id').val();
    const nombre = $('#editar_nombre').val();
    const operariosIds = operariosAsignados.map(op => op.id);
    
    $.ajax({
        url: `/maquinas/${maquinaId}`,
        type: 'PUT',
        data: {
            _token: $('input[name="_token"]').val(),
            nombre: nombre,
            operarios: operariosIds
        },
        success: function(response) {
            $('#modalEditarMaquina').modal('hide');
            // Actualizar la tabla o recargar la página
            window.location.reload();
        },
        error: function(xhr) {
            console.error('Error al actualizar máquina:', xhr.responseText);
            alert('Ha ocurrido un error al actualizar la máquina.');
        }
    });
});

// ...existing code...
