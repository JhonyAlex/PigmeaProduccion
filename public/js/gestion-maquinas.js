/**
 * Gestión de máquinas - Funcionalidades para agregar, editar y eliminar máquinas
 */
$(document).ready(function() {
    // Cargar máquinas al iniciar
    cargarMaquinas();
    
    // Evento para el formulario de agregar máquina
    $('#maquinaForm').on('submit', function(e) {
        e.preventDefault();
        agregarMaquina();
    });
    
    // Evento para el botón de eliminar máquina
    $(document).on('click', '.btn-eliminar-maquina', function() {
        const maquinaId = $(this).data('id');
        eliminarMaquina(maquinaId);
    });
});

// Función para cargar máquinas desde el servidor
function cargarMaquinas() {
    $.ajax({
        url: '/maquinas',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            mostrarMaquinas(response.maquinas || []);
        },
        error: function(xhr) {
            console.error('Error al cargar máquinas:', xhr);
            alert('No se pudieron cargar las máquinas');
        }
    });
}

// Función para mostrar las máquinas en la tabla
function mostrarMaquinas(maquinas) {
    const tabla = $('#tablaMaquinas tbody');
    tabla.empty();
    
    if (maquinas.length === 0) {
        tabla.append('<tr><td colspan="2" class="text-center">No hay máquinas registradas</td></tr>');
        return;
    }
    
    maquinas.forEach(function(maquina) {
        tabla.append(`
            <tr>
                <td>${maquina.nombre}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-warning btn-editar-maquina" data-id="${maquina.id}" data-nombre="${maquina.nombre}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger btn-eliminar-maquina" data-id="${maquina.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}

// Función para agregar una nueva máquina
function agregarMaquina() {
    const nombre = $('#nombreMaquina').val().trim();
    
    if (!nombre) {
        alert('Por favor, ingrese un nombre para la máquina');
        return;
    }
    
    $.ajax({
        url: '/maquinas',
        type: 'POST',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content'),
            nombre: nombre
        },
        success: function(response) {
            $('#nombreMaquina').val('');
            cargarMaquinas();
            alert('Máquina agregada correctamente');
        },
        error: function(xhr) {
            console.error('Error al agregar máquina:', xhr);
            alert('No se pudo agregar la máquina');
        }
    });
}

// Función para eliminar una máquina
function eliminarMaquina(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta máquina?')) {
        return;
    }
    
    $.ajax({
        url: `/maquinas/${id}`,
        type: 'DELETE',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            cargarMaquinas();
            alert('Máquina eliminada correctamente');
        },
        error: function(xhr) {
            console.error('Error al eliminar máquina:', xhr);
            alert('No se pudo eliminar la máquina');
        }
    });
}
