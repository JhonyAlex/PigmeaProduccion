// js/navigation.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Navegación entre secciones ---
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id$="Section"]');
    
    // Función para mostrar la sección seleccionada y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });
        
        // Actualizar clases activas en los enlaces de navegación
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active-section');
            } else {
                link.classList.remove('active-section');
            }
        });
    }
    
    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Actualizar la URL sin recargar la página
            const href = this.getAttribute('href');
            history.pushState(null, null, href);
            
            // Mostrar la sección correspondiente
            showSection(targetSection);
        });
    });
    
    // Manejar la navegación con el botón atrás/adelante del navegador
    window.addEventListener('popstate', function() {
        // Obtener el hash de la URL actual
        const hash = window.location.hash || '#dashboard';
        const sectionId = hash.replace('#', '') + 'Section';
        
        // Mostrar la sección correspondiente
        showSection(sectionId);
    });
    
    // Cargar la sección inicial basada en el hash de la URL
    function loadInitialSection() {
        const hash = window.location.hash || '#dashboard';
        const sectionId = hash.replace('#', '') + 'Section';
        showSection(sectionId);
    }
    
    // Cargar la sección inicial
    loadInitialSection();

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
    
    // Renderizado inicial de la tabla.
    renderOperariosTable();
    //Actualización inicial de los selects.
    updateOperarioSelect();
    updateOperarioReportesSelect();
    updateOperarioBaseDatosSelect();
});
