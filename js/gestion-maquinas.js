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
});
