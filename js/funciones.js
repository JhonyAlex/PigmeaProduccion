// js/funciones.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Gestión de Operarios ---
    const operarioForm = document.getElementById('operarioForm');
    const nombreOperarioInput = document.getElementById('nombreOperario');
    const tablaOperariosBody = document.getElementById('tablaOperarios').querySelector('tbody');
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

    // Función para renderizar (dibujar) la tabla de operarios.
    function renderOperariosTable() {
        tablaOperariosBody.innerHTML = ''; // Limpia el contenido actual de la tabla.

        const operarios = getOperarios(); // Obtiene la lista actual de operarios.
        const maquinasMap = getMaquinasMap(); // Obtiene un mapa de id -> nombre de máquina
        
        operarios.forEach((operario, index) => {
            const row = document.createElement('tr'); // Crea una nueva fila.
            
            // Obtener el nombre de la máquina en lugar de mostrar el ID
            const nombreMaquina = maquinasMap[operario.maquina] || 'Máquina no encontrada';
            
            row.innerHTML = `
                <td>${operario.nombre}</td>
                <td>${nombreMaquina}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar-operario" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editarOperarioModal">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar-operario" data-index="${index}">Eliminar</button>
                </td>
            `;
            tablaOperariosBody.appendChild(row);
        });

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

    //Función auxiliar para obtener un mapa de ID de máquina a nombre de máquina
    function getMaquinasMap() {
        const maquinasMap = {};
        const maquinas = getMaquinas();
        
        maquinas.forEach(maquina => {
            maquinasMap[maquina.id] = maquina.nombre;
        });
        
        return maquinasMap;
    }

    //Función para eliminar operarios
    function eliminarOperario(index) {
        let operarios = getOperarios(); // Obtiene la lista actual de operarios.
        operarios.splice(index, 1); // Elimina el operario en la posición 'index'.
        saveOperarios(operarios); // Guarda la lista actualizada en localStorage.
        renderOperariosTable(); // Vuelve a renderizar la tabla para mostrar los cambios.
        updateAllOperarioSelects();
    }

    // Agregar un nuevo operario.
    operarioForm.addEventListener('submit', function (e) {
        e.preventDefault();
        agregarNuevoOperario();
    });
    
    // Función para manejar la adición de un nuevo operario
    function agregarNuevoOperario() {
        const nombreOperario = nombreOperarioInput.value.trim();
        const maquinaSeleccionada = maquinaSelect.value;

        if (nombreOperario && maquinaSeleccionada) {
            const operarios = getOperarios();
            operarios.push({ nombre: nombreOperario, maquina: maquinaSeleccionada });
            saveOperarios(operarios);
            nombreOperarioInput.value = '';
            renderOperariosTable();
            updateAllOperarioSelects();
        } else {
            alert("Por favor complete todos los campos requeridos.");
        }
    }
    
    // Asegurarse de que el botón de agregar operario tenga un event listener
    const btnAgregarOperario = document.getElementById('btnAgregarOperario');
    if (btnAgregarOperario) {
        btnAgregarOperario.addEventListener('click', function(e) {
            e.preventDefault();
            agregarNuevoOperario();
        });
    }

    //Función para actualizar el select de la sección registro
    function updateOperarioSelect() {
        const selectOperario = document.getElementById('operario');
        if (selectOperario) {
            const valorActual = selectOperario.value; // Guardar valor actual
            selectOperario.innerHTML = '<option value="">Seleccionar...</option>';
            const operarios = getOperarios();
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.text = operario.nombre;
                if (valorActual === operario.nombre) {
                    option.selected = true;
                }
                selectOperario.appendChild(option);
            });
        }
    }

    //Función para actualizar el select de la sección reportes
    function updateOperarioReportesSelect() {
        const selectOperario = document.getElementById('reporteOperario');
        if (selectOperario) {
            const valorActual = selectOperario.value; // Guardar valor actual
            selectOperario.innerHTML = '<option value="">Todos</option>';
            const operarios = getOperarios();
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.text = operario.nombre;
                if (valorActual === operario.nombre) {
                    option.selected = true;
                }
                selectOperario.appendChild(option);
            });
        }
    }

    //Función para actualizar el select de la sección baseDatos
    function updateOperarioBaseDatosSelect() {
        const selectOperario = document.getElementById('filtroOperario');
        if (selectOperario) {
            const valorActual = selectOperario.value; // Guardar valor actual
            selectOperario.innerHTML = '<option value="">Todos los Operarios</option>';
            const operarios = getOperarios();
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.text = operario.nombre;
                if (valorActual === operario.nombre) {
                    option.selected = true;
                }
                selectOperario.appendChild(option);
            });
        }
    }

    // Función para actualizar todos los selectores de operarios a la vez
    function updateAllOperarioSelects() {
        updateOperarioSelect();
        updateOperarioReportesSelect();
        updateOperarioBaseDatosSelect();
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

    editarOperarioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const operarios = getOperarios();
        operarios[operarioIndex].nombre = editNombreOperarioInput.value.trim();
        operarios[operarioIndex].maquina = editMaquinaSelect.value;
        saveOperarios(operarios);

        renderOperariosTable();
        updateAllOperarioSelects();

        const modal = bootstrap.Modal.getInstance(editarOperarioModal);
        modal.hide();
    });

    function updateEditMaquinasSelect(maquinaSeleccionada) {
        editMaquinaSelect.innerHTML = '';
        const maquinas = getMaquinas();
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.text = maquina.nombre;
            option.selected = (maquina.id === maquinaSeleccionada); // Select the current machine
            editMaquinaSelect.appendChild(option);
        });
    }

    // Cargar las máquinas en el select cuando se carga la página
    function cargarMaquinasSelect() {
        const selectMaquinas = document.getElementById('maquina');
        const maquinas = getMaquinas();
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.text = maquina.nombre;
            selectMaquinas.appendChild(option);
        });
    }

    cargarMaquinasSelect();

    // Renderizado inicial de la tabla.
    renderOperariosTable();
    //Actualización inicial de los selects.
    updateOperarioSelect();
    updateOperarioReportesSelect();
    updateOperarioBaseDatosSelect();
});



// Inside js/funciones.js (or a similar file where you manage your JavaScript logic)

// --- Máquinas ---

// Array para almacenar las máquinas (simulando una base de datos)
let maquinas = [];

// Función para cargar las máquinas desde el almacenamiento local
function cargarMaquinas() {
    const maquinasGuardadas = localStorage.getItem('maquinas');
    if (maquinasGuardadas) {
        maquinas = JSON.parse(maquinasGuardadas);
    }
    actualizarTablaMaquinas();
    actualizarSelectMaquinas();
}

// Función para guardar las máquinas en el almacenamiento local
function guardarMaquinas() {
    localStorage.setItem('maquinas', JSON.stringify(maquinas));
}

// Función para agregar una nueva máquina
function agregarMaquina(nombre) {
    const nuevaMaquina = {
        id: generarIdUnico(), // Genera un ID único
        nombre: nombre
    };
    maquinas.push(nuevaMaquina);
    guardarMaquinas();
    actualizarTablaMaquinas();
    actualizarSelectMaquinas();
}

// Función para actualizar la tabla de máquinas en la sección de configuración
function actualizarTablaMaquinas() {
    const tablaMaquinas = document.getElementById('tablaMaquinas').querySelector('tbody');
    tablaMaquinas.innerHTML = ''; // Limpiar la tabla

    maquinas.forEach(maquina => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${maquina.nombre}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-editar-maquina" data-id="${maquina.id}">Editar</button>
                <button class="btn btn-sm btn-danger btn-eliminar-maquina" data-id="${maquina.id}">Eliminar</button>
            </td>
        `;
        tablaMaquinas.appendChild(fila);
    });

    // Agregar event listeners a los botones de editar y eliminar
    agregarEventListenersMaquinas();
}

// Función para actualizar los select de máquinas en los formularios
function actualizarSelectMaquinas() {
    // Selecciona explícitamente todos los selectores necesarios, incluyendo el selector 'maquina'
    const selectMaquinas = document.querySelectorAll('select[id$="Maquina"], select[id="maquina"], select[id="editMaquinaOperario"]');
    
    selectMaquinas.forEach(select => {
        const valorActual = select.value; // Guardar el valor actual si es necesario mantenerlo
        select.innerHTML = '<option value="">Seleccione...</option>'; // Limpiar el select
        
        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id;
            option.textContent = maquina.nombre;
            // Opcionalmente, mantener la selección actual si coincide con alguna máquina
            if (valorActual === maquina.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
    
    // Asegurarse de que el primer selector tenga un texto diferente si es necesario
    const maquinaSelect = document.getElementById('maquina');
    if (maquinaSelect && maquinaSelect.options[0]) {
        maquinaSelect.options[0].text = "Seleccionar Máquina...";
    }
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
    }
}

// Función para editar una máquina
function editarMaquina(id, nuevoNombre) {
    const maquina = maquinas.find(maquina => maquina.id === id);
    if (maquina) {
        maquina.nombre = nuevoNombre;
        guardarMaquinas();
        actualizarTablaMaquinas();
        actualizarSelectMaquinas();
    }
}

// Función para agregar los event listeners a los botones de editar y eliminar
function agregarEventListenersMaquinas() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar-maquina');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
            //mostrarModalConfirmacion('¿Estás seguro de que deseas eliminar esta máquina?', () => {
                eliminarMaquina(id);
            //});
        });
    });

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
