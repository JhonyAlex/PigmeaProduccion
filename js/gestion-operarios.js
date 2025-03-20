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
    function cargarOperarios() {
        // Recuperar operarios del localStorage o inicializar
        operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        actualizarTablaOperarios();
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
    
    function editarOperario(operarioId) {
        const operario = operarios.find(op => op.id === operarioId);
        if (!operario) return;
        
        operarioIdActual = operarioId;
        editNombreOperarioInput.value = operario.nombre;
        editMaquinaOperarioSelect.value = operario.maquinaId || '';
        
        editarOperarioModal.show();
    }
    
    function guardarCambiosOperario(e) {
        e.preventDefault();
        
        if (!operarioIdActual) return;
        
        const nombre = editNombreOperarioInput.value.trim();
        const maquinaId = editMaquinaOperarioSelect.value;
        
        if (!nombre) {
            alert('Por favor, ingrese el nombre del operario');
            return;
        }
        
        const operarioIndex = operarios.findIndex(op => op.id === operarioIdActual);
        if (operarioIndex === -1) return;
        
        const operarioAnterior = operarios[operarioIndex];
        const maquinaIdAnterior = operarioAnterior.maquinaId;
        
        // Actualizar operario
        operarios[operarioIndex] = {
            ...operarioAnterior,
            nombre: nombre,
            maquinaId: maquinaId
        };
        
        localStorage.setItem('operarios', JSON.stringify(operarios));
        
        // Si cambió la máquina, actualizar relaciones
        if (maquinaIdAnterior !== maquinaId) {
            // Si tenía una máquina asignada antes, quitar la relación
            if (maquinaIdAnterior) {
                quitarRelacionMaquinaOperario(maquinaIdAnterior, operarioIdActual);
            }
            
            // Si tiene una nueva máquina asignada, crear la relación
            if (maquinaId) {
                actualizarRelacionMaquinaOperario(maquinaId, operarioIdActual);
            }
        }
        
        operarioIdActual = null;
        editarOperarioModal.hide();
        
        // Usar la función global de limpieza de modales
        if (window.limpiarModales) {
            window.limpiarModales();
        }
        
        actualizarTablaOperarios();
        sincronizarConModuloMaquinas();
    }
    
    function confirmarEliminarOperario(operarioId) {
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmTitle').textContent = 'Eliminar Operario';
        document.getElementById('confirmBody').textContent = '¿Está seguro de que desea eliminar este operario?';
        
        const btnConfirmar = document.getElementById('btnConfirmar');
        
        // Remover listeners previos
        const nuevoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
        
        // Agregar nuevo listener
        nuevoBtn.addEventListener('click', function() {
            eliminarOperario(operarioId);
            confirmModal.hide();
        });
        
        confirmModal.show();
    }
    
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
        // Esta función asigna un operario a una máquina
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const maquinaIndex = maquinas.findIndex(m => m.id === maquinaId);
        
        if (maquinaIndex !== -1) {
            // Crear un array de operarios asignados si no existe
            if (!maquinas[maquinaIndex].operariosAsignados) {
                maquinas[maquinaIndex].operariosAsignados = [];
            }
            
            // Agregar el operario si no está ya asignado
            if (!maquinas[maquinaIndex].operariosAsignados.includes(operarioId)) {
                maquinas[maquinaIndex].operariosAsignados.push(operarioId);
                localStorage.setItem('maquinas', JSON.stringify(maquinas));
            }
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
