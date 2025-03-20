document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const maquinaForm = document.getElementById('maquinaForm');
    const nombreMaquinaInput = document.getElementById('nombreMaquina');
    const tablaMaquinas = document.getElementById('tablaMaquinas');
    
    // Cargar máquinas al iniciar
    cargarMaquinas();
    
    // Event listener para el formulario de agregar máquina
    maquinaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombreMaquina = nombreMaquinaInput.value.trim();
        
        if (nombreMaquina) {
            agregarMaquina(nombreMaquina);
            nombreMaquinaInput.value = '';
        }
    });
    
    // Función para agregar una máquina
    function agregarMaquina(nombre) {
        // Obtener máquinas existentes del localStorage
        let maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        
        // Crear objeto de máquina
        const nuevaMaquina = {
            id: Date.now(), // ID único basado en timestamp
            nombre: nombre
        };
        
        // Agregar a la lista y guardar
        maquinas.push(nuevaMaquina);
        localStorage.setItem('maquinas', JSON.stringify(maquinas));
        
        // Actualizar la tabla
        cargarMaquinas();
        
        // Notificar al usuario
        alert(`Máquina "${nombre}" agregada correctamente`);
    }
    
    // Función para cargar máquinas en la tabla
    function cargarMaquinas() {
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        
        // Limpiar tabla
        tablaMaquinas.querySelector('tbody').innerHTML = '';
        
        // Agregar filas
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
            tablaMaquinas.querySelector('tbody').appendChild(fila);
        });
        
        // Agregar listeners a los botones de editar y eliminar
        document.querySelectorAll('.btn-editar-maquina').forEach(btn => {
            btn.addEventListener('click', handleEditarMaquina);
        });
        
        document.querySelectorAll('.btn-eliminar-maquina').forEach(btn => {
            btn.addEventListener('click', handleEliminarMaquina);
        });
        
        // Actualizar la lista de máquinas en otros selectores
        actualizarSelectoresMaquina();
    }
    
    // Función para manejar la edición de máquina
    function handleEditarMaquina(e) {
        const maquinaId = parseInt(e.currentTarget.dataset.id);
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const maquina = maquinas.find(m => m.id === maquinaId);
        
        if (maquina) {
            // Aquí se puede implementar la lógica para abrir el modal de edición
            document.getElementById('editar_maquina_id').value = maquina.id;
            document.getElementById('editar_nombre').value = maquina.nombre;
            
            // Abrir el modal
            const modalEditarMaquina = new bootstrap.Modal(document.getElementById('modalEditarMaquina'));
            modalEditarMaquina.show();
        }
    }
    
    // Función para manejar la eliminación de máquina
    function handleEliminarMaquina(e) {
        if (confirm('¿Estás seguro de que deseas eliminar esta máquina?')) {
            const maquinaId = parseInt(e.currentTarget.dataset.id);
            let maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
            
            // Filtrar la máquina a eliminar
            maquinas = maquinas.filter(m => m.id !== maquinaId);
            
            // Guardar el arreglo actualizado
            localStorage.setItem('maquinas', JSON.stringify(maquinas));
            
            // Actualizar la tabla
            cargarMaquinas();
        }
    }
    
    // Función para actualizar los selectores de máquina en todos los formularios
    function actualizarSelectoresMaquina() {
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const selectores = [
            document.getElementById('maquina'),
            document.getElementById('editMaquina'),
            document.getElementById('editMaquinaOperario')
        ];
        
        selectores.forEach(selector => {
            if (selector) {
                // Guardar la opción seleccionada si existe
                const valorSeleccionado = selector.value;
                
                // Limpiar opciones actuales excepto la primera
                while (selector.options.length > 1) {
                    selector.remove(1);
                }
                
                // Agregar opciones de máquinas
                maquinas.forEach(maquina => {
                    const option = document.createElement('option');
                    option.value = maquina.id;
                    option.textContent = maquina.nombre;
                    selector.appendChild(option);
                });
                
                // Restaurar la selección si es posible
                if (valorSeleccionado) {
                    selector.value = valorSeleccionado;
                }
            }
        });
    }
    
    // Configurar evento para el formulario de editar máquina
    const formEditarMaquina = document.getElementById('formEditarMaquina');
    if (formEditarMaquina) {
        formEditarMaquina.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const maquinaId = parseInt(document.getElementById('editar_maquina_id').value);
            const nuevoNombre = document.getElementById('editar_nombre').value.trim();
            
            if (nuevoNombre) {
                // Actualizar la máquina
                let maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
                const index = maquinas.findIndex(m => m.id === maquinaId);
                
                if (index !== -1) {
                    maquinas[index].nombre = nuevoNombre;
                    localStorage.setItem('maquinas', JSON.stringify(maquinas));
                    
                    // Cerrar el modal y actualizar la tabla
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalEditarMaquina'));
                    modalInstance.hide();
                    
                    cargarMaquinas();
                }
            }
        });
    }
    
    // Manejar el evento de reiniciar sistema
    document.getElementById('btnReiniciarSistema').addEventListener('click', function() {
        // Mostrar modal de confirmación
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmTitle').textContent = "Reiniciar Sistema";
        document.getElementById('confirmBody').textContent = "¡ADVERTENCIA! Esta acción eliminará TODOS los datos del sistema. ¿Estás seguro de que deseas continuar?";
        
        // Configurar el botón de confirmación
        const btnConfirmar = document.getElementById('btnConfirmar');
        btnConfirmar.classList.remove('btn-primary');
        btnConfirmar.classList.add('btn-danger');
        
        // Evento para el botón de confirmación
        const confirmHandler = function() {
            // Limpiar todo el localStorage
            localStorage.clear();
            
            // Mostrar mensaje de éxito
            alert('Sistema reiniciado correctamente. Se han eliminado todos los datos.');
            
            // Recargar la página
            location.reload();
            
            // Eliminar el evento después de usarlo
            btnConfirmar.removeEventListener('click', confirmHandler);
        };
        
        // Agregar el evento al botón
        btnConfirmar.addEventListener('click', confirmHandler);
        
        // Mostrar el modal
        confirmModal.show();
    });
    
    // Función para cargar máquinas en el modal de edición
    function cargarMaquinasEdicion() {
        // Recuperar las máquinas del localStorage
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const selectMaquina = document.getElementById('editMaquinaOperario');
        
        // Limpiar opciones existentes
        selectMaquina.innerHTML = '<option value="">Seleccionar Máquina...</option>';
        
        // Agregar las máquinas al select
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.textContent = maquina.nombre;
            selectMaquina.appendChild(option);
        });
    }
    
    // Evento para abrir el modal de editar operario
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-editar-operario')) {
            const operarioId = e.target.getAttribute('data-id');
            const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
            const operario = operarios.find(op => op.id == operarioId);
            
            if (operario) {
                document.getElementById('editNombreOperario').value = operario.nombre;
                
                // Cargar las máquinas en el select
                cargarMaquinasEdicion();
                
                // Seleccionar la máquina del operario
                const selectMaquina = document.getElementById('editMaquinaOperario');
                for (let i = 0; i < selectMaquina.options.length; i++) {
                    if (selectMaquina.options[i].value == operario.maquinaId) {
                        selectMaquina.selectedIndex = i;
                        break;
                    }
                }
                
                // Guardar el ID del operario para usarlo al guardar
                document.getElementById('editarOperarioForm').setAttribute('data-operario-id', operarioId);
                
                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('editarOperarioModal'));
                modal.show();
            }
        }
    });
    
    // Manejar el envío del formulario de edición de operario
    document.getElementById('editarOperarioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const operarioId = this.getAttribute('data-operario-id');
        const nuevoNombre = document.getElementById('editNombreOperario').value;
        const nuevaMaquinaId = document.getElementById('editMaquinaOperario').value;
        
        const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const indice = operarios.findIndex(op => op.id == operarioId);
        
        if (indice !== -1) {
            operarios[indice].nombre = nuevoNombre;
            operarios[indice].maquinaId = nuevaMaquinaId;
            
            // Obtener el nombre de la máquina
            const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
            const maquina = maquinas.find(m => m.id == nuevaMaquinaId);
            operarios[indice].maquina = maquina ? maquina.nombre : '';
            
            // Guardar los cambios
            localStorage.setItem('operarios', JSON.stringify(operarios));
            
            // Actualizar la tabla de operarios
            actualizarTablaOperarios();
            
            // Cerrar el modal
            bootstrap.Modal.getInstance(document.getElementById('editarOperarioModal')).hide();
        }
    });
    
    // Función para actualizar la tabla de operarios
    function actualizarTablaOperarios() {
        const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const tbody = document.querySelector('#tablaOperarios tbody');
        
        // Limpiar la tabla
        tbody.innerHTML = '';
        
        // Agregar los operarios a la tabla
        operarios.forEach(operario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${operario.nombre}</td>
                <td>${operario.maquina || 'No asignada'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning btn-editar-operario" data-id="${operario.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar-operario" data-id="${operario.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // Manejar el modal de edición de máquina
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-editar-maquina')) {
            const maquinaId = e.target.getAttribute('data-id');
            const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
            const maquina = maquinas.find(m => m.id == maquinaId);
            
            if (maquina) {
                document.getElementById('editar_maquina_id').value = maquinaId;
                document.getElementById('editar_nombre').value = maquina.nombre;
                
                // Cargar operarios asignados a esta máquina
                cargarOperariosAsignados(maquinaId);
                
                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('modalEditarMaquina'));
                modal.show();
            }
        }
    });
    
    // Función para cargar los operarios asignados a una máquina
    function cargarOperariosAsignados(maquinaId) {
        const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const operariosAsignados = operarios.filter(op => op.maquinaId == maquinaId);
        const contenedor = document.getElementById('operarios-asignados');
        
        // Limpiar el contenedor
        contenedor.innerHTML = '';
        
        // Si no hay operarios asignados
        if (operariosAsignados.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay operarios asignados a esta máquina.</p>';
            return;
        }
        
        // Crear un elemento para cada operario asignado
        operariosAsignados.forEach(operario => {
            const div = document.createElement('div');
            div.className = 'mb-1 d-flex align-items-center';
            div.innerHTML = `
                <span class="me-2">${operario.nombre}</span>
                <button type="button" class="btn btn-sm btn-outline-danger btn-quitar-operario" data-id="${operario.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            contenedor.appendChild(div);
        });
    }
    
    // Manejar el botón para agregar operario a la máquina
    document.getElementById('btn-agregar-operario').addEventListener('click', function() {
        // Obtener operarios no asignados a esta máquina
        const maquinaId = document.getElementById('editar_maquina_id').value;
        const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
        const operariosNoAsignados = operarios.filter(op => op.maquinaId != maquinaId);
        
        const selectOperario = document.getElementById('select-operario');
        selectOperario.innerHTML = '';
        
        // Si no hay operarios disponibles
        if (operariosNoAsignados.length === 0) {
            selectOperario.innerHTML = '<option value="">No hay operarios disponibles</option>';
        } else {
            // Llenar el select con operarios no asignados
            operariosNoAsignados.forEach(op => {
                const option = document.createElement('option');
                option.value = op.id;
                option.textContent = op.nombre;
                selectOperario.appendChild(option);
            });
        }
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalSeleccionarOperario'));
        modal.show();
    });
    
    // Manejar la confirmación de agregar operario a la máquina
    document.getElementById('btn-confirmar-operario').addEventListener('click', function() {
        const operarioId = document.getElementById('select-operario').value;
        const maquinaId = document.getElementById('editar_maquina_id').value;
        
        if (operarioId) {
            // Actualizar el operario con la nueva máquina
            const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
            const indice = operarios.findIndex(op => op.id == operarioId);
            
            if (indice !== -1) {
                // Obtener el nombre de la máquina
                const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
                const maquina = maquinas.find(m => m.id == maquinaId);
                
                operarios[indice].maquinaId = maquinaId;
                operarios[indice].maquina = maquina ? maquina.nombre : '';
                
                // Guardar los cambios
                localStorage.setItem('operarios', JSON.stringify(operarios));
                
                // Actualizar la lista de operarios asignados
                cargarOperariosAsignados(maquinaId);
                
                // Cerrar el modal
                bootstrap.Modal.getInstance(document.getElementById('modalSeleccionarOperario')).hide();
            }
        }
    });
    
    // Manejar la eliminación de operario de la máquina
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.btn-quitar-operario')) {
            const btn = e.target.closest('.btn-quitar-operario');
            const operarioId = btn.getAttribute('data-id');
            
            // Actualizar el operario para quitar la máquina
            const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
            const indice = operarios.findIndex(op => op.id == operarioId);
            
            if (indice !== -1) {
                operarios[indice].maquinaId = '';
                operarios[indice].maquina = '';
                
                // Guardar los cambios
                localStorage.setItem('operarios', JSON.stringify(operarios));
                
                // Actualizar la lista de operarios asignados
                const maquinaId = document.getElementById('editar_maquina_id').value;
                cargarOperariosAsignados(maquinaId);
            }
        }
    });
    
    // Manejar el envío del formulario de edición de máquina
    document.getElementById('formEditarMaquina').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const maquinaId = document.getElementById('editar_maquina_id').value;
        const nuevoNombre = document.getElementById('editar_nombre').value;
        
        // Actualizar la máquina
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const indice = maquinas.findIndex(m => m.id == maquinaId);
        
        if (indice !== -1) {
            const nombreAnterior = maquinas[indice].nombre;
            maquinas[indice].nombre = nuevoNombre;
            
            // Guardar los cambios
            localStorage.setItem('maquinas', JSON.stringify(maquinas));
            
            // Actualizar el nombre de la máquina en los operarios
            const operarios = JSON.parse(localStorage.getItem('operarios')) || [];
            operarios.forEach((op, idx) => {
                if (op.maquinaId == maquinaId) {
                    operarios[idx].maquina = nuevoNombre;
                }
            });
            localStorage.setItem('operarios', JSON.stringify(operarios));
            
            // Actualizar la tabla de máquinas
            actualizarTablaMaquinas();
            
            // Actualizar la tabla de operarios
            actualizarTablaOperarios();
            
            // Cerrar el modal
            bootstrap.Modal.getInstance(document.getElementById('modalEditarMaquina')).hide();
        }
    });
    
    // Función para actualizar la tabla de máquinas
    function actualizarTablaMaquinas() {
        const maquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
        const tbody = document.querySelector('#tablaMaquinas tbody');
        
        // Limpiar la tabla
        tbody.innerHTML = '';
        
        // Agregar las máquinas a la tabla
        maquinas.forEach(maquina => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${maquina.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning btn-editar-maquina" data-id="${maquina.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar-maquina" data-id="${maquina.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
});
