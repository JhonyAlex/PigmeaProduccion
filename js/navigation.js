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

document.addEventListener('DOMContentLoaded', function() {
    // Manejar la navegación entre secciones
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id$="Section"]');
    
    // Establecer la sección activa
    function setActiveSection(sectionId) {
        // Ocultar todas las secciones
        sections.forEach(section => {
            section.classList.add('d-none');
        });
        
        // Mostrar la sección seleccionada
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.remove('d-none');
            console.log(`Sección activa: ${sectionId}`);
            
            // Si se navega a la sección de configuración, inicializar explícitamente los botones
            if (sectionId === 'configuracionSection') {
                console.log('Inicializando botones de configuración');
                setTimeout(() => {
                    const btnReiniciarSistema = document.getElementById('btnReiniciarSistema');
                    if (btnReiniciarSistema) {
                        // Eliminar todos los event listeners existentes
                        const nuevoBtn = btnReiniciarSistema.cloneNode(true);
                        btnReiniciarSistema.parentNode.replaceChild(nuevoBtn, btnReiniciarSistema);
                        
                        // Agregar el nuevo event listener
                        nuevoBtn.addEventListener('click', function() {
                            console.log('Evento click en btnReiniciarSistema');
                            // Mostrar modal de confirmación
                            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
                            document.getElementById('confirmTitle').textContent = 'Reiniciar Sistema';
                            document.getElementById('confirmBody').innerHTML = `
                                <p class="text-danger"><strong>¡ADVERTENCIA!</strong></p>
                                <p>Esta acción eliminará <strong>TODOS</strong> los datos del sistema, incluyendo:</p>
                                <ul>
                                    <li>Operarios</li>
                                    <li>Máquinas</li>
                                    <li>Registros de producción</li>
                                    <li>Configuraciones</li>
                                </ul>
                                <p>Esta acción no se puede deshacer. ¿Está seguro de continuar?</p>
                            `;
                            
                            // Remover listeners previos del botón confirmar
                            const btnConfirmar = document.getElementById('btnConfirmar');
                            const nuevoBtnConfirmar = btnConfirmar.cloneNode(true);
                            btnConfirmar.parentNode.replaceChild(nuevoBtnConfirmar, btnConfirmar);
                            
                            // Añadir nuevo listener para ejecutar el reinicio
                            nuevoBtnConfirmar.addEventListener('click', function() {
                                // Lista de claves específicas de la aplicación para borrar
                                localStorage.clear(); // Borrar todo el localStorage
                                
                                // Cerrar el modal
                                confirmModal.hide();
                                
                                // Recargar la página para reflejar los cambios
                                setTimeout(() => {
                                    alert('Sistema reiniciado correctamente. La página se recargará.');
                                    window.location.reload();
                                }, 500);
                            });
                            
                            confirmModal.show();
                        });
                        
                        console.log('Event listener agregado a btnReiniciarSistema');
                    } else {
                        console.warn('Botón reiniciar sistema no encontrado');
                    }
                    
                    // Inicializar otros botones específicos de configuración si es necesario
                }, 100); // Pequeño retraso para asegurar que el DOM está completamente cargado
            }
        }
    }
    
    // Manejar clics en los links de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Agregar clase activa al link actual
            this.classList.add('active');
            
            // Obtener el ID de la sección a mostrar
            const sectionId = this.getAttribute('data-section');
            
            // Actualizar la URL con el fragmento
            history.pushState(null, null, this.getAttribute('href'));
            
            // Activar la sección correspondiente
            setActiveSection(sectionId);
        });
    });
    
    // Manejar navegación inicial basada en la URL
    function handleInitialNavigation() {
        const hash = window.location.hash || '#dashboard';
        const matchingLink = document.querySelector(`.nav-link[href="${hash}"]`);
        
        if (matchingLink) {
            matchingLink.classList.add('active');
            const sectionId = matchingLink.getAttribute('data-section');
            setActiveSection(sectionId);
        } else {
            // Por defecto, mostrar el dashboard
            const dashboardLink = document.querySelector('.nav-link[href="#dashboard"]');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
                setActiveSection('dashboardSection');
            }
        }
    }
    
    // Inicializar la navegación
    handleInitialNavigation();
    
    // Escuchar cambios en la URL (para navegación con los botones atrás/adelante)
    window.addEventListener('popstate', handleInitialNavigation);
});
