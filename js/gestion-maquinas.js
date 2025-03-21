document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const maquinaForm = document.getElementById('maquinaForm');
    const nombreMaquinaInput = document.getElementById('nombreMaquina');
    const tablaMaquinas = document.getElementById('tablaMaquinas');
    const modalEditarMaquina = new bootstrap.Modal(document.getElementById('modalEditarMaquina'));
    const formEditarMaquina = document.getElementById('formEditarMaquina');
    const editarNombreInput = document.getElementById('editar_nombre');
    const editarMaquinaIdInput = document.getElementById('editar_maquina_id');
    const operariosAsignadosContainer = document.getElementById('operarios-asignados');
    const btnAgregarOperario = document.getElementById('btn-agregar-operario');
    const modalSeleccionarOperario = new bootstrap.Modal(document.getElementById('modalSeleccionarOperario'));
    const selectOperario = document.getElementById('select-operario');
    const btnConfirmarOperario = document.getElementById('btn-confirmar-operario');

    // Variables para gestión
    let maquinaActualId = null;
    let maquinas = [];
    let operarios = [];
    
    // Inicialización
    cargarMaquinas();
    cargarOperarios();
    
    // Event Listeners
    maquinaForm.addEventListener('submit', agregarMaquina);
    formEditarMaquina.addEventListener('submit', guardarCambiosMaquina);
    btnAgregarOperario.addEventListener('click', mostrarModalSeleccionarOperario);
    btnConfirmarOperario.addEventListener('click', agregarOperarioAMaquina);
    
    // Gestión de eventos de click delegados
    document.addEventListener('click', function(event) {
        // Editar máquina
        if (event.target.classList.contains('btn-editar-maquina') || 
            event.target.closest('.btn-editar-maquina')) {
            const btn = event.target.classList.contains('btn-editar-maquina') ? 
                        event.target : event.target.closest('.btn-editar-maquina');
            const maquinaId = btn.dataset.id;
            editarMaquina(maquinaId);
        }
        
        // Eliminar máquina
        if (event.target.classList.contains('btn-eliminar-maquina') || 
            event.target.closest('.btn-eliminar-maquina')) {
            const btn = event.target.classList.contains('btn-eliminar-maquina') ? 
                        event.target : event.target.closest('.btn-eliminar-maquina');
            const maquinaId = btn.dataset.id;
            confirmarEliminarMaquina(maquinaId);
        }
        
        // Eliminar operario de máquina
        if (event.target.classList.contains('btn-quitar-operario') || 
            event.target.closest('.btn-quitar-operario')) {
            const btn = event.target.classList.contains('btn-quitar-operario') ? 
                        event.target : event.target.closest('.btn-quitar-operario');
            const operarioId = btn.dataset.operarioId;
            quitarOperarioDeMaquina(operarioId);
        }
    });

    // Limpiar backdrop al cerrar los modales
    document.getElementById('modalEditarMaquina').addEventListener('hidden.bs.modal', function () {
        limpiarBackdrop();
    });
    
    document.getElementById('modalSeleccionarOperario').addEventListener('hidden.bs.modal', function () {
        limpiarBackdrop();
    });
    
    // Funciones
    function limpiarBackdrop() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    function cargarMaquinas() {
        maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        actualizarTablaMaquinas();
    }
    
    function cargarOperarios() {
        operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        actualizarSelectorOperarios();
    }
    
    function actualizarTablaMaquinas() {
        const tbody = tablaMaquinas.querySelector('tbody');
        tbody.innerHTML = '';
        
        maquinas.forEach(maquina => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${maquina.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-editar-maquina" data-id="${maquina.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar-maquina" data-id="${maquina.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
        
        // Si está cargado el módulo de operarios, actualizar su selector también
        if (window.gestionOperarios) {
            window.gestionOperarios.cargarMaquinasParaSelect();
        }
    }
    
    function actualizarSelectorOperarios() {
        selectOperario.innerHTML = '<option value="">Seleccionar operario...</option>';
        
        // Obtener operarios que no están asignados a la máquina actual
        let operariosNoAsignados = [...operarios];
        
        if (maquinaActualId) {
            const maquina = maquinas.find(m => m.id === maquinaActualId);
            if (maquina && maquina.operariosAsignados) {
                // Filtrar solo operarios que no estén ya asignados a esta máquina
                operariosNoAsignados = operarios.filter(op => 
                    !maquina.operariosAsignados.includes(op.id) && 
                    (!op.maquinaId || op.maquinaId === maquinaActualId)
                );
            }
        }



// === NUEVAS FUNCIONES PARA AGREGAR A gestion-maquinas.js ===

// Función para mostrar alertas (si no existe)
function mostrarAlerta(mensaje, tipo) {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertaDiv.role = 'alert';
    alertaDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    // Insertar alerta en el DOM (ajusta el selector según tu HTML)
    document.querySelector('#alertas').appendChild(alertaDiv);
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        alertaDiv.remove();
    }, 3000);
}

// Función para actualizar la lista de operarios asignados 
function actualizarListaOperariosAsignados(maquinaId) {
    const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
    const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
    const maquina = maquinas.find(m => m.id === maquinaId);
    
    if (!maquina || !maquina.operariosAsignados || maquina.operariosAsignados.length === 0) {
        $('#listaOperariosAsignados').html('<p>No hay operarios asignados a esta máquina</p>');
        return;
    }
    
    let html = '<ul class="list-group">';
    maquina.operariosAsignados.forEach(operarioId => {
        const operario = operarios.find(o => o.id === operarioId);
        if (operario) {
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${operario.nombre}
                    <button class="btn btn-sm btn-danger remover-operario" data-operario-id="${operario.id}" data-maquina-id="${maquinaId}">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `;
        }
    });
    html += '</ul>';
    
    $('#listaOperariosAsignados').html(html);
    
    // Asignar evento a los botones de remover
    $('.remover-operario').on('click', function() {
        const operarioId = $(this).data('operario-id');
        const maquinaId = $(this).data('maquina-id');
        desasignarOperario(operarioId, maquinaId);
    });
}

// Función para actualizar el selector de operarios disponibles
function actualizarSelectorOperariosDisponibles(maquinaId) {
    const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
    const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
    
    // Limpiar selector
    $('#selectOperarios').empty();
    $('#selectOperarios').append('<option value="">Seleccione un operario</option>');
    
    // Filtrar operarios disponibles
    const operariosDisponibles = operarios.filter(operario => {
        // Si no tiene máquina asignada, está disponible
        if (!operario.maquinaAsignada) return true;
        
        // Si ya está asignado a esta máquina, mostrarlo también
        return operario.maquinaAsignada === maquinaId;
    });
    
    if (operariosDisponibles.length === 0) {
        $('#selectOperarios').append('<option disabled>No hay operarios disponibles</option>');
        $('#btnAgregarOperarioAMaquina').prop('disabled', true);
    } else {
        operariosDisponibles.forEach(operario => {
            $('#selectOperarios').append(`<option value="${operario.id}">${operario.nombre}</option>`);
        });
        $('#btnAgregarOperarioAMaquina').prop('disabled', false);
    }
}

// Función para desasignar un operario de una máquina
function desasignarOperario(operarioId, maquinaId) {
    if (confirm('¿Está seguro de que desea remover este operario de la máquina?')) {
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
            
            // Actualizar la interfaz
            actualizarListaOperariosAsignados(maquinaId);
            actualizarSelectorOperariosDisponibles(maquinaId);
            
            mostrarAlerta('Operario removido de la máquina correctamente', 'success');
        }
    }
}












        
        // Ordenar los operarios por nombre para mejor usabilidad
        operariosNoAsignados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        operariosNoAsignados.forEach(operario => {
            const option = document.createElement('option');
            option.value = operario.id;
            option.textContent = operario.nombre;
            selectOperario.appendChild(option);
        });
        
        // Si no hay operarios disponibles, mostrar mensaje en el selector
        if (operariosNoAsignados.length === 0) {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = "No hay operarios disponibles";
            selectOperario.appendChild(option);
        }
    }
    
    function agregarMaquina(e) {
        e.preventDefault();
        
        const nombre = nombreMaquinaInput.value.trim();
        if (!nombre) {
            alert('Por favor, ingrese el nombre de la máquina');
            return;
        }
        
        const nuevaMaquina = {
            id: Date.now().toString(),
            nombre: nombre,
            operariosAsignados: []
        };
        
        maquinas.push(nuevaMaquina);
        localStorage.setItem('maquinas', JSON.stringify(maquinas));
        
        nombreMaquinaInput.value = '';
        actualizarTablaMaquinas();
    }
    
    function editarMaquina(maquinaId) {
        const maquina = maquinas.find(m => m.id === maquinaId);
        if (!maquina) return;
        
        maquinaActualId = maquinaId;
        editarMaquinaIdInput.value = maquinaId;
        editarNombreInput.value = maquina.nombre;
        
        // Cargar operarios asignados
        mostrarOperariosAsignados();
        
        modalEditarMaquina.show();
    }
    
    function mostrarOperariosAsignados() {
        operariosAsignadosContainer.innerHTML = '';

        const maquina = maquinas.find(m => m.id === maquinaActualId);
        if (!maquina || !maquina.operariosAsignados || maquina.operariosAsignados.length === 0) {
            operariosAsignadosContainer.innerHTML = '<p class="text-muted">No hay operarios asignados</p>';
            return;
        }

        const listaOperarios = document.createElement('ul');
        listaOperarios.className = 'list-group';

        maquina.operariosAsignados.forEach(operarioId => {
            const operario = operarios.find(op => op.id === operarioId);
            if (!operario) return;

            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                ${operario.nombre}
                <button type="button" class="btn btn-sm btn-danger btn-quitar-operario" data-operario-id="${operarioId}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            listaOperarios.appendChild(item);
        });

        operariosAsignadosContainer.appendChild(listaOperarios);
    }

    function guardarCambiosMaquina(e) {
        e.preventDefault();

        if (!maquinaActualId) return;

        const nombre = editarNombreInput.value.trim();
        if (!nombre) {
            alert('Por favor, ingrese el nombre de la máquina');
            return;
        }

        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaActualId);
        if (maquinaIndex === -1) return;

        const nombreAnterior = maquinas[maquinaIndex].nombre;  //Guardo el nombre anterior
        maquinas[maquinaIndex].nombre = nombre;
        localStorage.setItem('maquinas', JSON.stringify(maquinas));

        modalEditarMaquina.hide();

        if (window.limpiarModales) {
            window.limpiarModales();
        }

        maquinaActualId = null;
        actualizarTablaMaquinas();

        if (window.gestionOperarios) {
            window.gestionOperarios.actualizarTablaOperarios();
        }

        if (nombreAnterior !== nombre) {
            alert(`Máquina "${nombreAnterior}" actualizada a "${nombre}" correctamente.`);
        }
    }

    function mostrarModalSeleccionarOperario() {
        actualizarSelectorOperarios();

        const hayOperariosDisponibles = Array.from(selectOperario.options)
            .some(option => !option.disabled && option.value);

        if (!hayOperariosDisponibles) {
            alert("No hay operarios disponibles para asignar a esta máquina.");
            return;
        }

        modalSeleccionarOperario.show();
    }

    function agregarOperarioAMaquina() {
        const operarioId = selectOperario.value;
        if (!operarioId || !maquinaActualId) {
            modalSeleccionarOperario.hide();
            if (window.limpiarModales) {
                window.limpiarModales();
            }
            return;
        }

        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaActualId);
        if (maquinaIndex === -1) {
            modalSeleccionarOperario.hide();
            if (window.limpiarModales) {
                window.limpiarModales();
            }
            return;
        }

        // Verificar si el operario ya está asignado a otra máquina
        const operarioData = operarios.find(op => op.id === operarioId);
        if (operarioData && operarioData.maquinaId && operarioData.maquinaId !== maquinaActualId) {
            const maquinaAnterior = maquinas.find(m => m.id === operarioData.maquinaId);
            if (maquinaAnterior && confirm(`El operario "${operarioData.nombre}" ya está asignado a la máquina "${maquinaAnterior.nombre}". ¿Desea reasignarlo?`)) {
                // Quitar de la máquina anterior
                quitarOperarioDeMaquinaById(operarioData.maquinaId, operarioId);
            } else {
                modalSeleccionarOperario.hide();
                if (window.limpiarModales) {
                    window.limpiarModales();
                }
                return;
            }
        }

        // Inicializar array si no existe
        if (!maquinas[maquinaIndex].operariosAsignados) {
            maquinas[maquinaIndex].operariosAsignados = [];
        }

        // Agregar operario si no está ya asignado
        if (!maquinas[maquinaIndex].operariosAsignados.includes(operarioId)) {
            maquinas[maquinaIndex].operariosAsignados.push(operarioId);

            // Actualizar también la relación en el operario
            const operariosData = JSON.parse(localStorage.getItem('operarios')) || [];
            const operarioIndex = operariosData.findIndex(op => op.id === operarioId);

            if (operarioIndex !== -1) {
                operariosData[operarioIndex].maquinaId = maquinaActualId;
                localStorage.setItem('operarios', JSON.stringify(operariosData));

                // Actualizar operarios locales
                operarios = operariosData;
            }

            localStorage.setItem('maquinas', JSON.stringify(maquinas));
            mostrarOperariosAsignados();
             // Mostrar mensaje de confirmación
            alert(`Operario "${operarioData.nombre}" asignado a la máquina "${maquinas[maquinaIndex].nombre}"`);
        }

        modalSeleccionarOperario.hide();
        if (window.limpiarModales) {
            window.limpiarModales();
        }
    }

    function quitarOperarioDeMaquina(operarioId) {
        if (!maquinaActualId) return;

        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaActualId);
        if (maquinaIndex === -1) return;

        // Quitar operario de la máquina
        if (maquinas[maquinaIndex].operariosAsignados) {
            maquinas[maquinaIndex].operariosAsignados = maquinas[maquinaIndex].operariosAsignados
                .filter(id => id !== operarioId);

            // Actualizar también la relación en el operario
            const operariosData = JSON.parse(localStorage.getItem('operarios')) || [];
            const operarioIndex = operariosData.findIndex(op => op.id === operarioId);

            if (operarioIndex !== -1 && operariosData[operarioIndex].maquinaId === maquinaActualId) {
                operariosData[operarioIndex].maquinaId = '';
                localStorage.setItem('operarios', JSON.stringify(operariosData));

                // Actualizar operarios locales
                operarios = operariosData;
            }

            localStorage.setItem('maquinas', JSON.stringify(maquinas));
            mostrarOperariosAsignados();
        }
    }

    function quitarOperarioDeMaquinaById(maquinaId, operarioId) {
        if (!maquinaId || !operarioId) return;

        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaId);
        if (maquinaIndex === -1) return;

        // Quitar operario de la máquina
        if (maquinas[maquinaIndex].operariosAsignados) {
            maquinas[maquinaIndex].operariosAsignados = maquinas[maquinaIndex].operariosAsignados
                .filter(id => id !== operarioId);

            localStorage.setItem('maquinas', JSON.stringify(maquinas));
        }
    }

   function confirmarEliminarMaquina(maquinaId) {
        const maquina = maquinas.find(m => m.id === maquinaId);
        if (!maquina) return;

        // Verificar si la máquina tiene operarios asignados
        const tieneOperariosAsignados = maquina.operariosAsignados &&
                                            maquina.operariosAsignados.length > 0;

        if (tieneOperariosAsignados) {
            // Hay operarios asignados, mostrar alerta especial
            const operariosAsignados = maquina.operariosAsignados.map(opId => {
                const operario = operarios.find(op => op.id === opId);
                return operario ? operario.nombre : 'Desconocido';
            }).join(', ');

            alert(`No se puede eliminar la máquina "${maquina.nombre}" porque tiene operarios asignados: ${operariosAsignados}.\n\nPor favor, desasigne los operarios primero.`);
            return;
        }

        // Si no hay operarios asignados, proceder con la confirmación normal
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmTitle').textContent = 'Eliminar Máquina';
        document.getElementById('confirmBody').textContent = '¿Está seguro de que desea eliminar esta máquina?';

        const btnConfirmar = document.getElementById('btnConfirmar');

        // Remover listeners previos
        const nuevoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);

        // Agregar nuevo listener
        nuevoBtn.addEventListener('click', function() {
            eliminarMaquina(maquinaId);
            confirmModal.hide();
        });

        confirmModal.show();
    }

    function eliminarMaquina(maquinaId) {
        const maquina = maquinas.find(m => m.id === maquinaId);
        if (!maquina) return;

        // Actualizar operarios relacionados
        if (maquina.operariosAsignados && maquina.operariosAsignados.length > 0) {
            const operariosData = JSON.parse(localStorage.getItem('operarios')) || [];

            maquina.operariosAsignados.forEach(operarioId => {
                const operarioIndex = operariosData.findIndex(op => op.id === operarioId);
                if (operarioIndex !== -1 && operariosData[operarioIndex].maquinaId === maquinaId) { //Verifico que el operario corresponda a la maquina
                    operariosData[operarioIndex].maquinaId = '';
                }
            });

            localStorage.setItem('operarios', JSON.stringify(operariosData));

            // Actualizar operarios locales
            operarios = operariosData;

            // Si existe el módulo de operarios, actualizar esa información
            if (window.gestionOperarios) {
                window.gestionOperarios.cargarOperarios();
            }
        }

        // Eliminar máquina
        maquinas = maquinas.filter(m => m.id !== maquinaId);
        localStorage.setItem('maquinas', JSON.stringify(maquinas));

        // Limpiar cualquier modal abierto
        if (window.limpiarModales) {
            window.limpiarModales();
        }

        actualizarTablaMaquinas();
    }
    
    // Exponer funciones públicas
    window.gestionMaquinas = {
        cargarMaquinas,
        actualizarTablaMaquinas,
        quitarOperarioDeMaquinaById
    };
});
