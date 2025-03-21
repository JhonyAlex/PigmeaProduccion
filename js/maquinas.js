// js/operarios.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Gestión de Operarios ---
    const operarioForm = document.getElementById('operarioForm');
    const nombreOperarioInput = document.getElementById('nombreOperario');
    const tablaOperariosBody = document.getElementById('tablaOperarios')?.querySelector('tbody'); // Añadido operador de encadenamiento opcional
    const maquinaSelect = document.getElementById('maquina'); // Nuevo: Select de máquinas

    // Función para obtener los operarios desde LocalStorage.
    function getOperarios() {
        const operariosJSON = localStorage.getItem('operarios');
        return operariosJSON ? JSON.parse(operariosJSON) : [];
    }

    // Función para guardar los operarios en LocalStorage.
    function saveOperarios(operarios) {
        localStorage.setItem('operarios', JSON.stringify(operarios));
    }

    //Función para obtener las maquinas.
    function getMaquinas() {
        const maquinasJSON = localStorage.getItem('maquinas');
        return maquinasJSON ? JSON.parse(maquinasJSON) : [];
    }
     // Añadido comprobación
    if(!tablaOperariosBody) return;
    // Función para renderizar (dibujar) la tabla de operarios.
    function renderOperariosTable() {
        tablaOperariosBody.innerHTML = ''; // Limpia el contenido actual de la tabla.

<<<<<<< HEAD
        const operarios = getOperarios(); // Obtiene la lista actual de operarios.
        operarios.forEach((operario, index) => {
            const row = document.createElement('tr'); // Crea una nueva fila.
            row.innerHTML = `
                <td>${operario.nombre}</td>
                <td>${obtenerNombreMaquinaPorId(operario.maquina)}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar-operario" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editarOperarioModal">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar-operario" data-index="${index}">Eliminar</button>
                </td>
            `;
            tablaOperariosBody.appendChild(row);
        });
=======
// Función para actualizar la tabla de máquinas en la sección de configuración
function actualizarTablaMaquinas() {
    const tablaMaquinas = document.getElementById('tablaMaquinas').querySelector('tbody');
    tablaMaquinas.innerHTML = ''; // Limpiar la tabla
>>>>>>> parent of 6e6a0a0 (MEjora selección máquina)

        // Eventos de escucha para los botones "Eliminar" y "Editar" (después de renderizar)
        const deleteButtons = tablaOperariosBody.querySelectorAll('.btn-eliminar-operario');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                eliminarOperario(index);
            });
        });
        // Eventos de escucha para los botones "editar" (después de renderizar)
        const editButtons = tablaOperariosBody.querySelectorAll('.btn-editar-operario');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cargarDatosOperario(index);
            });
        });
    }

    //Función para eliminar operarios
    function eliminarOperario(index) {
        let operarios = getOperarios(); // Obtiene la lista actual de operarios.
        operarios.splice(index, 1); // Elimina el operario en la posición 'index'.
        saveOperarios(operarios); // Guarda la lista actualizada en localStorage.
        renderOperariosTable(); // Vuelve a renderizar la tabla para mostrar los cambios.
        updateOperarioSelect();
        updateOperarioReportesSelect();
        updateOperarioBaseDatosSelect();
    }

    // Agregar un nuevo operario.
    operarioForm?.addEventListener('submit', function (e) { // Añadido operador de encadenamiento opcional
        e.preventDefault();
        const nombreOperario = nombreOperarioInput.value.trim();
        const maquinaSeleccionada = maquinaSelect.value;

        if (nombreOperario && maquinaSeleccionada) {
            const operarios = getOperarios();
            operarios.push({ nombre: nombreOperario, maquina: maquinaSeleccionada }); // Ahora guarda un objeto con nombre y máquina
            saveOperarios(operarios);
            nombreOperarioInput.value = '';
            renderOperariosTable();

            updateOperarioSelect();
            updateOperarioReportesSelect();
            updateOperarioBaseDatosSelect();

        }
    });

    //Función para actualizar el select de la sección registro
    function updateOperarioSelect() {
        const selectOperario = document.getElementById('operario');
        if (!selectOperario) return; // añadido
        selectOperario.innerHTML = '<option value="">Seleccionar...</option>';
        const operarios = getOperarios();
        operarios.forEach(operario => {
            const option = document.createElement('option');
            option.value = operario.nombre;
            option.text = operario.nombre;
            selectOperario.appendChild(option);
        });
<<<<<<< HEAD
=======
    });
     //Recargar los selectores de operarios, al modificarse el de maquinas
    cargarMaquinasSelect();
    updateEditMaquinasSelect();
}

// Función para generar un ID único
function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para eliminar una máquina
function eliminarMaquina(id) {
    const index = maquinas.findIndex(maquina => maquina.id === id);
    if (index !== -1) {
        maquinas.splice(index, 1);
        guardarMaquinas();
        actualizarTablaMaquinas();
        actualizarSelectMaquinas();
>>>>>>> parent of 6e6a0a0 (MEjora selección máquina)
    }

    //Función para actualizar el select de la sección reportes
    function updateOperarioReportesSelect() {
        const selectOperario = document.getElementById('reporteOperario');
        if (!selectOperario) return; // añadido
        selectOperario.innerHTML = '<option value="">Todos</option>';
        const operarios = getOperarios();
        operarios.forEach(operario => {
            const option = document.createElement('option');
            option.value = operario.nombre;
            option.text = operario.nombre;
            selectOperario.appendChild(option);
        });
    }

<<<<<<< HEAD
    //Función para actualizar el select de la sección baseDatos
    function updateOperarioBaseDatosSelect() {
        const selectOperario = document.getElementById('filtroOperario');
        if (!selectOperario) return; // añadido
        selectOperario.innerHTML = '<option value="">Todos los Operarios</option>';
        const operarios = getOperarios();
        operarios.forEach(operario => {
            const option = document.createElement('option');
            option.value = operario.nombre;
            option.text = operario.nombre;
            selectOperario.appendChild(option);
=======
// Función para agregar los event listeners a los botones de editar y eliminar
function agregarEventListenersMaquinas() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar-maquina');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
                eliminarMaquina(id);
>>>>>>> parent of 6e6a0a0 (MEjora selección máquina)
        });
    }

    //Modal editar operario
    const editarOperarioModal = document.getElementById('editarOperarioModal');
    const editarOperarioForm = document.getElementById('editarOperarioForm');
    const editNombreOperarioInput = document.getElementById('editNombreOperario');
    const editMaquinaSelect = document.getElementById('editMaquinaOperario');
    let operarioIndex = null; // Variable para guardar el índice del operario que se está editando.

    function cargarDatosOperario(index) {
        const operarios = getOperarios();
        operarioIndex = index;
        const operario = operarios[index];
        editNombreOperarioInput.value = operario.nombre;
        updateEditMaquinasSelect(operario.maquina)
    }

    editarOperarioForm?.addEventListener('submit', (e) => { // Añadido operador de encadenamiento opcional
        e.preventDefault();
        const operarios = getOperarios();
        operarios[operarioIndex].nombre = editNombreOperarioInput.value.trim();
        operarios[operarioIndex].maquina = editMaquinaSelect.value;
        saveOperarios(operarios);

        renderOperariosTable();
        updateOperarioSelect();
        updateOperarioReportesSelect();
        updateOperarioBaseDatosSelect();

        const modal = bootstrap.Modal.getInstance(editarOperarioModal);
        modal.hide();
    });
<<<<<<< HEAD
    
    // Renderizado inicial de la tabla.
    renderOperariosTable();
    //Actualización inicial de los selects.
    updateOperarioSelect();
    updateOperarioReportesSelect();
    updateOperarioBaseDatosSelect();
});
=======

    const botonesEditar = document.querySelectorAll('.btn-editar-maquina');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
            const maquina = maquinas.find(maquina => maquina.id === id);
            if (maquina) {
                mostrarModalEditarMaquina(maquina);
            }
        });
    });
}


// Variable global para almacenar el ID de la máquina que se está editando
let maquinaAEditarId = null;

// Función para mostrar el modal de editar máquina
function mostrarModalEditarMaquina(maquina) {
    // Guardar el ID de la máquina que se va a editar
    maquinaAEditarId = maquina.id;

    // Obtener el modal y el input
    const modal = document.getElementById('editarMaquinaModal');
    const nombreInput = document.getElementById('editNombreMaquina');

    // Rellenar el input con el nombre actual de la máquina
    nombreInput.value = maquina.nombre;

    // Mostrar el modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Event listener para el formulario del modal
const editarMaquinaForm = document.getElementById('editarMaquinaForm');
editarMaquinaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nuevoNombre = document.getElementById('editNombreMaquina').value;
    editarMaquina(maquinaAEditarId, nuevoNombre); // Usar el ID guardado
    const modal = document.getElementById('editarMaquinaModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});

// Event listener para el formulario de agregar máquina
document.getElementById('maquinaForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombreMaquina = document.getElementById('nombreMaquina').value;
    if (nombreMaquina.trim() !== '') {
        agregarMaquina(nombreMaquina);
        document.getElementById('nombreMaquina').value = ''; // Limpiar el campo
    } else {
        alert("El nombre de la máquina no puede estar vacío.");
    }
});

// Cargar las máquinas al iniciar la página
cargarMaquinas();

//Funcion para obtener el nombre de la maquina a partir del id
function obtenerNombreMaquinaPorId(id) {
    const maquina = maquinas.find(m => m.id === id);
    return maquina ? maquina.nombre : 'Máquina no encontrada';
}
>>>>>>> parent of 6e6a0a0 (MEjora selección máquina)
