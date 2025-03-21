document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const operarioForm = document.getElementById('operarioForm');
    const nombreOperarioInput = document.getElementById('nombreOperario');
    const maquinaSelect = document.getElementById('maquina');
    const tablaOperarios = document.getElementById('tablaOperarios');
    const editarOperarioModal = new bootstrap.Modal(document.getElementById('editarOperarioModal'));
    const editNombreOperarioInput = document.getElementById('editNombreOperario');
    const editMaquinaOperarioSelect = document.getElementById('editMaquinaOperario');
    const editarOperarioForm = document.getElementById('editarOperarioForm');
    
    // Variables para almacenar datos
    let operarioIdActual = null;
    let operarios = [];
    let maquinas = [];
    
    // Inicialización: cargar datos
    cargarOperarios();
    cargarMaquinasParaSelect();
    
    // Event Listeners
    operarioForm.addEventListener('submit', agregarOperario);
    editarOperarioForm.addEventListener('submit', guardarCambiosOperario);
    document.addEventListener('click', function(event) {
        // Botones de editar operario
        if (event.target.classList.contains('btn-editar-operario') || 
            event.target.closest('.btn-editar-operario')) {
            const btn = event.target.classList.contains('btn-editar-operario') ? 
                        event.target : event.target.closest('.btn-editar-operario');
            const operarioId = btn.dataset.id;
            editarOperario(operarioId);
        }
        
        // Botones de eliminar operario
        if (event.target.classList.contains('btn-eliminar-operario') || 
            event.target.closest('.btn-eliminar-operario')) {
            const btn = event.target.classList.contains('btn-eliminar-operario') ? 
                        event.target : event.target.closest('.btn-eliminar-operario');
            const operarioId = btn.dataset.id;
            confirmarEliminarOperario(operarioId);
        }
    });
    
    // Cuando se cierra el modal, limpiamos el backdrop manualmente
    document.getElementById('editarOperarioModal').addEventListener('hidden.bs.modal', function () {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });
    
    // Funciones
// MODIFICA la función cargarOperarios para corregir la visualización de máquinas asignadas
function cargarOperarios() {
    const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
    const tablaOperarios = document.getElementById('tablaOperarios');
    
    if (operarios.length === 0) {
        tablaOperarios.innerHTML = '<tr><td colspan="4" class="text-center">No hay operarios registrados</td></tr>';
        return;
    }
    
    let html = '';
    operarios.forEach(operario => {
        // Obtener el nombre de la máquina asignada, si existe
        let maquinaAsignada = 'No asignado';
        
        if (operario.maquinaAsignada) {
            const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
            const maquina = maquinas.find(m => m.id === operario.maquinaAsignada);
            if (maquina) {
                maquinaAsignada = maquina.nombre;
            } else {
                // La máquina ya no existe, corregir la referencia
                maquinaAsignada = 'Máquina no encontrada';
                
                // Actualizar operario para eliminar la referencia a una máquina que ya no existe
                operario.maquinaAsignada = null;
                localStorage.setItem('operarios', JSON.stringify(operarios));
            }
        }
        
        html += `
            <tr>
                <td>${operario.nombre}</td>
                <td>${maquinaAsignada}</td>
                <td>
                    <button class="btn btn-sm btn-primary editar-operario" data-id="${operario.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger eliminar-operario" data-id="${operario.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
    
    tablaOperarios.innerHTML = html;
}
    
    function cargarMaquinasParaSelect() {
        // Recuperar máquinas del localStorage
        maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        
        // Actualizar selector de máquinas en el formulario principal
        maquinaSelect.innerHTML = '<option value="">Seleccionar Máquina...</option>';
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.textContent = maquina.nombre;
            maquinaSelect.appendChild(option);
        });
        
        // Actualizar selector de máquinas en el formulario de edición
        editMaquinaOperarioSelect.innerHTML = '<option value="">Seleccionar Máquina...</option>';
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.textContent = maquina.nombre;
            editMaquinaOperarioSelect.appendChild(option);
        });
    }
    
    function actualizarTablaOperarios() {
        const tbody = tablaOperarios.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Asegurarse de tener los datos más recientes de máquinas
        maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        
        operarios.forEach(operario => {
            const fila = document.createElement('tr');
            
            // Encontrar la máquina asociada
            let nombreMaquina = 'No asignada';
            if (operario.maquinaId) {
                const maquina = maquinas.find(m => m.id === operario.maquinaId);
                if (maquina) {
                    nombreMaquina = maquina.nombre;
                } else {
                    // Si la máquina no existe, actualizar el operario
                    operario.maquinaId = '';
                }
            }
            
            fila.innerHTML = `
                <td>${operario.nombre}</td>
                <td>${nombreMaquina}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-editar-operario" data-id="${operario.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar-operario" data-id="${operario.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(fila);
        });
        
        // Guardar cambios si hubo alguna corrección
        localStorage.setItem('operarios', JSON.stringify(operarios));
        
        // Actualizar también el selector de operarios en la sección Registro
        actualizarSelectorOperariosRegistro();
    }

    function editarOperario(operarioId) {
        const operario = operarios.find(op => op.id === operarioId);
        if (!operario) return;
        
        operarioIdActual = operarioId;
        editNombreOperarioInput.value = operario.nombre;
        
        // Cargar y seleccionar la máquina del operario
        cargarMaquinasParaSelect();
        editMaquinaOperarioSelect.value = operario.maquinaId || ''; // Asegúrate de que el select tenga un valor
        
        editarOperarioModal.show();
    }
    
    function actualizarSelectorOperariosRegistro() {
        const selectorOperario = document.getElementById('operario');
        const editOperario = document.getElementById('editOperario');
        
        if (selectorOperario) {
            selectorOperario.innerHTML = '<option value="">Seleccionar...</option>';
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.id;
                option.textContent = operario.nombre;
                selectorOperario.appendChild(option);
            });
        }
        
        if (editOperario) {
            editOperario.innerHTML = '<option value="">Seleccionar...</option>';
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.id;
                option.textContent = operario.nombre;
                editOperario.appendChild(option);
            });
        }
    }
    
    function agregarOperario(e) {
        e.preventDefault();
        
        const nombre = nombreOperarioInput.value.trim();
        const maquinaId = maquinaSelect.value;
        
        if (!nombre) {
            alert('Por favor, ingrese el nombre del operario');
            return;
        }
        
        const nuevoOperario = {
            id: Date.now().toString(),
            nombre: nombre,
            maquinaId: maquinaId
        };
        
        operarios.push(nuevoOperario);
        localStorage.setItem('operarios', JSON.stringify(operarios));
        
        // Actualizar la relación máquina-operario si se seleccionó una máquina
        if (maquinaId) {
            actualizarRelacionMaquinaOperario(maquinaId, nuevoOperario.id);
        }
        
        nombreOperarioInput.value = '';
        maquinaSelect.value = '';
        
        actualizarTablaOperarios();
    }
    
// AGREGA o MODIFICA la función para desasignar operarios si existe
function desasignarOperario(operarioId, maquinaId) {
    let maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
    let operarios = JSON.parse(localStorage.getItem('operarios')) || [];
    
    // Encontrar la máquina y el operario
    const maquina = maquinas.find(m => m.id === maquinaId);
    const operario = operarios.find(o => o.id === operarioId);
    
    if (maquina && operario) {
        // Remover operario de la máquina
        if (maquina.operariosAsignados) {
            maquina.operariosAsignados = maquina.operariosAsignados.filter(
                id => id !== operarioId
            );
        }
        
        // Quitar referencia de la máquina en el operario
        delete operario.maquinaAsignada;
        
        // Guardar cambios
        localStorage.setItem('maquinas', JSON.stringify(maquinas));
        localStorage.setItem('operarios', JSON.stringify(operarios));
        
        return true;
    }
    
    return false;
}





    // REEMPLAZA el evento para guardar la edición del operario:
    $('#btnGuardarEdicionOperario').on('click', function() {
        const id = $('#editOperarioId').val();
        const nombre = $('#editOperarioNombre').val().trim();
        const maquinaId = editMaquinaOperarioSelect.value; // Obtener la máquina seleccionada
        
        if (!nombre) {
            mostrarAlerta('Por favor ingrese un nombre para el operario', 'warning');
            return;
        }
        
        let operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const index = operarios.findIndex(o => o.id === id);
        
        if (index !== -1) {
            const operarioAnterior = operarios[index]; // Guardar datos del operario antes de la modificación
            
            // Actualizar nombre y máquina asignada
            operarios[index] = {
                id: id,
                nombre: nombre,
                maquinaId: maquinaId  // Actualizar con el ID de la máquina
            };
            
            localStorage.setItem('operarios', JSON.stringify(operarios));
            
            // Actualizar la máquina en la tabla de máquinas
            actualizarRelacionMaquinaOperario(maquinaId, id);
            
            cargarOperarios();
            actualizarTablaOperarios();
            editarOperarioModal.hide();
            
            // Mostrar alerta de éxito
            mostrarAlerta('Operario actualizado correctamente', 'success');
            
            // Si la máquina asignada ha cambiado, mostrar un mensaje informativo
            if (operarioAnterior.maquinaId !== maquinaId) {
                const maquinaAnteriorObj = maquinas.find(m => m.id === operarioAnterior.maquinaId);
                const maquinaNuevaObj = maquinas.find(m => m.id === maquinaId);
                
                let mensaje = `Operario "${nombre}"`;
                if (maquinaAnteriorObj) {
                    mensaje += ` desasignado de la máquina "${maquinaAnteriorObj.nombre}"`;
                }
                if (maquinaNuevaObj) {
                    mensaje += ` y asignado a la máquina "${maquinaNuevaObj.nombre}"`;
                }
                mensaje += ".";
                alert(mensaje); // Usar alert para mantener la consistencia con otros mensajes
            }
        }
    });
    
// AGREGA este código para limpiar correctamente los modales
$('#modalEditarOperario').on('hidden.bs.modal', function () {
    // Limpiar el contenido del modal cuando se cierra
    $('#editOperarioNombre').val('');
    $('#editOperarioId').val('');
    
    // Eliminar cualquier modal-backdrop adicional
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
});

// Si tienes un modal para asignar máquinas, también agrega esto:
$('#modalAsignarMaquina').on('hidden.bs.modal', function () {
    $('#selectMaquinas').empty();
    $('#operarioAsignarId').val('');
    
    // Eliminar cualquier modal-backdrop adicional
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
});







    // REEMPLAZA el evento para eliminar un operario con este código actualizado:
$(document).on('click', '.eliminar-operario', function() {
    const operarioId = $(this).data('id');
    
    if (confirm('¿Está seguro de que desea eliminar este operario? Esta acción no se puede deshacer.')) {
        let operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        let maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        
        // Encontrar el operario a eliminar
        const operarioIndex = operarios.findIndex(o => o.id === operarioId);
        
        if (operarioIndex !== -1) {
            const operario = operarios[operarioIndex];
            
            // Si el operario está asignado a una máquina, actualizar la máquina
            if (operario.maquinaAsignada) {
                const maquina = maquinas.find(m => m.id === operario.maquinaAsignada);
                
                if (maquina && maquina.operariosAsignados) {
                    // Eliminar el operario de la lista de operarios asignados
                    maquina.operariosAsignados = maquina.operariosAsignados.filter(
                        id => id !== operarioId
                    );
                    
                    // Guardar los cambios en las máquinas
                    localStorage.setItem('maquinas', JSON.stringify(maquinas));
                }
            }
            
            // Eliminar el operario del array
            operarios.splice(operarioIndex, 1);
            
            // Guardar el array actualizado en localStorage
            localStorage.setItem('operarios', JSON.stringify(operarios));
            
            // Actualizar la tabla
            cargarOperarios();
            
            mostrarAlerta('Operario eliminado correctamente', 'success');
        }
    }
});
    
    function eliminarOperario(operarioId) {
        const operario = operarios.find(op => op.id === operarioId);
        if (!operario) return;
        
        // Si el operario está asignado a una máquina, quitar la relación
        if (operario.maquinaId) {
            quitarRelacionMaquinaOperario(operario.maquinaId, operarioId);
        }
        
        // Eliminar operario
        operarios = operarios.filter(op => op.id !== operarioId);
        localStorage.setItem('operarios', JSON.stringify(operarios));
        
        actualizarTablaOperarios();
    }
    
    function actualizarRelacionMaquinaOperario(maquinaId, operarioId) {
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaId);
        const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const operarioIndexEnOperarios = operarios.findIndex(o => o.id === operarioId);
    
        if (maquinaIndex !== -1) {
            // Primero, quitar el operario de cualquier máquina a la que esté asignado
            maquinas.forEach(maq => {
                if (maq.operariosAsignados && maq.operariosAsignados.includes(operarioId)) {
                    maq.operariosAsignados = maq.operariosAsignados.filter(id => id !== operarioId);
                }
            });
    
            // Luego, asignar el operario a la nueva máquina
            if (!maquinas[maquinaIndex].operariosAsignados) {
                maquinas[maquinaIndex].operariosAsignados = [];
            }
            if (!maquinas[maquinaIndex].operariosAsignados.includes(operarioId)) {
                maquinas[maquinaIndex].operariosAsignados.push(operarioId);
            }
    
            localStorage.setItem('maquinas', JSON.stringify(maquinas));
        }
    
        if (operarioIndexEnOperarios !== -1) {
            operarios[operarioIndexEnOperarios].maquinaId = maquinaId;
            localStorage.setItem('operarios', JSON.stringify(operarios));
        }
    }
    
    function quitarRelacionMaquinaOperario(maquinaId, operarioId) {
        // Esta función quita un operario de una máquina
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaId);
        
        if (maquinaIndex !== -1 && maquinas[maquinaIndex].operariosAsignados) {
            maquinas[maquinaIndex].operariosAsignados = maquinas[maquinaIndex].operariosAsignados
                .filter(id => id !== operarioId);
            localStorage.setItem('maquinas', JSON.stringify(maquinas));
        }
    }
    
    // Agregar una función para sincronizar entre módulos
    function sincronizarConModuloMaquinas() {
        if (window.gestionMaquinas) {
            window.gestionMaquinas.cargarMaquinas();
        }
    }
    
    // Exponer funciones públicas actualizadas
    window.gestionOperarios = {
        cargarOperarios,
        cargarMaquinasParaSelect,
        actualizarTablaOperarios,
        actualizarSelectorOperariosRegistro,
        sincronizarConModuloMaquinas
    };
});
