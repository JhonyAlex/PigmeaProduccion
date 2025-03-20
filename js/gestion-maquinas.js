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
                operariosNoAsignados = operarios.filter(op => 
                    !maquina.operariosAsignados.includes(op.id)
                );
            }
        }
        
        operariosNoAsignados.forEach(operario => {
            const option = document.createElement('option');
            option.value = operario.id;
            option.textContent = operario.nombre;
            selectOperario.appendChild(option);
        });
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
        
        const nombreAnterior = maquinas[maquinaIndex].nombre;
        maquinas[maquinaIndex].nombre = nombre;
        localStorage.setItem('maquinas', JSON.stringify(maquinas));
        
        modalEditarMaquina.hide();
        
        // Usar la función global de limpieza de modales
        if (window.limpiarModales) {
            window.limpiarModales();
        }
        
        maquinaActualId = null;
        actualizarTablaMaquinas();
        
        // Si existe el módulo de operarios, actualizar esa información también
        if (window.gestionOperarios) {
            window.gestionOperarios.actualizarTablaOperarios();
        }
        
        // Mostrar mensaje de confirmación solo si cambió el nombre
        if (nombreAnterior !== nombre) {
            alert(`Máquina "${nombreAnterior}" actualizada a "${nombre}" correctamente.`);
        }
    }
    
    function mostrarModalSeleccionarOperario() {
        actualizarSelectorOperarios();
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
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmTitle').textContent = 'Eliminar Máquina';
        document.getElementById('confirmBody').textContent = '¿Está seguro de que desea eliminar esta máquina? Esta acción afectará a los operarios asignados.';
        
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
                if (operarioIndex !== -1) {
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
