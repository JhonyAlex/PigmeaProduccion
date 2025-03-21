<<<<<<< HEAD
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
        const operarioEliminado = operarios.splice(index, 1)[0]; // Elimina el operario en la posición 'index' y obtiene el operario eliminado.
        saveOperarios(operarios); // Guarda la lista actualizada en localStorage.
        renderOperariosTable(); // Vuelve a renderizar la tabla para mostrar los cambios.
        updateAllOperarioSelects();

        // Actualizar la máquina del operario eliminado
        if (operarioEliminado && operarioEliminado.maquina) {
            const maquinas = getMaquinas();
            const maquinaIndex = maquinas.findIndex(m => m.id === operarioEliminado.maquina);
            if (maquinaIndex !== -1) {
                // Filtra el operario eliminado de la lista de operarios asignados a la máquina
                maquinas[maquinaIndex].operariosAsignados = maquinas[maquinaIndex].operariosAsignados.filter(idOperario => idOperario !== index);
                localStorage.setItem('maquinas', JSON.stringify(maquinas));
            }
        }
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
            // Verifica si ya existe un operario con el mismo nombre
            const operarioExistente = operarios.find(o => o.nombre === nombreOperario);
            if (operarioExistente) {
                alert("Ya existe un operario con este nombre. Por favor, elija un nombre diferente.");
                return; // Detiene la ejecución si el nombre ya existe
            }
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
        updateEditMaquinasSelect(operario.maquina);
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


    function obtenerNombreMaquinaPorId(maquinaId) {
        const maquinas = getMaquinas(); // Obtiene el array de máquinas
        const maquina = maquinas.find(m => m.id === maquinaId); // Busca la máquina por ID
        return maquina ? maquina.nombre : 'No asignada'; // Devuelve el nombre o 'No asignada'
    }

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

// Función para reiniciar el sistema (borrar todos los datos)
function inicializarBtnReiniciarSistema() {
    const btnReiniciarSistema = document.getElementById('btnReiniciarSistema');
    
    if (btnReiniciarSistema) {
        btnReiniciarSistema.addEventListener('click', function() {
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
            const nuevoBtn = btnConfirmar.cloneNode(true);
            btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
            
            // Añadir nuevo listener para ejecutar el reinicio
            nuevoBtn.addEventListener('click', function() {
                // Lista de claves específicas de la aplicación para borrar
                const keysToRemove = [
                    'operarios',
                    'maquinas',
                    'registros',
                    'configuracion',
                    'produccion',
                    'usuarios',
                    'pedidos',
                    'turnos',
                    'reportes',
                    'ultimosRegistros'
                    // Añadir cualquier otra clave específica que use la aplicación
                ];
                
                // Borrar elementos específicos del localStorage
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                });
                
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
    }
}

// Inicializar el botón de limpiar registros antiguos
function inicializarBtnLimpiarRegistros() {
    const btnLimpiarRegistros = document.getElementById('btnLimpiarRegistros');
    
    if (btnLimpiarRegistros) {
        btnLimpiarRegistros.addEventListener('click', function() {
            // Mostrar modal para solicitar fecha límite
            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            document.getElementById('confirmTitle').textContent = 'Limpiar Registros Antiguos';
            document.getElementById('confirmBody').innerHTML = `
                <p>Eliminar todos los registros anteriores a una fecha específica.</p>
                <div class="mb-3">
                    <label for="fechaLimpieza" class="form-label">Eliminar registros anteriores a:</label>
                    <input type="date" class="form-control" id="fechaLimpieza" required>
                </div>
            `;
            
            // Remover listeners previos
            const btnConfirmar = document.getElementById('btnConfirmar');
            const nuevoBtn = btnConfirmar.cloneNode(true);
            btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
            
            // Nueva funcionalidad
            nuevoBtn.addEventListener('click', function() {
                const fechaLimpieza = document.getElementById('fechaLimpieza').value;
                
                if (!fechaLimpieza) {
                    alert('Por favor, seleccione una fecha válida');
                    return;
                }
                
                // Convertir a fecha para comparación
                const fechaLimite = new Date(fechaLimpieza);
                
                // Obtener registros actuales
                const registros = JSON.parse(localStorage.getItem('registros') || '[]');
                
                // Filtrar solo los registros posteriores a la fecha límite
                const registrosFiltrados = registros.filter(registro => {
                    const fechaRegistro = new Date(registro.fecha);
                    return fechaRegistro >= fechaLimite;
                });
                
                // Guardar los registros filtrados
                localStorage.setItem('registros', JSON.stringify(registrosFiltrados));
                
                // Cerrar modal
                confirmModal.hide();
                
                // Mostrar mensaje de éxito
                const registrosEliminados = registros.length - registrosFiltrados.length;
                alert(`Se han eliminado ${registrosEliminados} registros antiguos.`);
                
                // Actualizar tablas si es necesario
                if (window.actualizarTablaDatos) {
                    window.actualizarTablaDatos();
                }
            });
            
            confirmModal.show();
        });
    }
}

// Inicializar botones de importación/exportación
function inicializarBotonesImportacionExportacion() {
    // Botón para exportar todo (backup)
    const btnExportarTodo = document.getElementById('btnExportarTodo');
    if (btnExportarTodo) {
        btnExportarTodo.addEventListener('click', function() {
            // Crear un objeto con todos los datos relevantes del sistema
            const backupData = {
                version: window.appConfig ? window.appConfig.version : '1.0.0',
                timestamp: new Date().toISOString(),
                data: {
                    operarios: JSON.parse(localStorage.getItem('operarios') || '[]'),
                    maquinas: JSON.parse(localStorage.getItem('maquinas') || '[]'),
                    registros: JSON.parse(localStorage.getItem('registros') || '[]'),
                    configuracion: JSON.parse(localStorage.getItem('configuracion') || '{}')
                    // Añadir otros datos que quieras incluir en el backup
                }
            };
            
            // Convertir a JSON y crear el blob
            const jsonData = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // Crear URL para descarga
            const url = URL.createObjectURL(blob);
            
            // Crear elemento de descarga y simular click
            const a = document.createElement('a');
            a.href = url;
            a.download = `pigmea_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        });
    }
    
    // Botón para importar todo
    const btnImportarTodo = document.getElementById('btnImportarTodo');
    const importFile = document.getElementById('importFile');
    const reemplazarDatos = document.getElementById('reemplazarDatos');
    
    if (btnImportarTodo && importFile) {
        btnImportarTodo.addEventListener('click', function() {
            if (!importFile.files || importFile.files.length === 0) {
                alert('Por favor, seleccione un archivo para importar');
                return;
            }
            
            const file = importFile.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    // Verificar formato básico
                    if (!backupData.data) {
                        throw new Error('Formato de archivo inválido');
                    }
                    
                    // Mostrar confirmación
                    const debeReemplazar = reemplazarDatos && reemplazarDatos.checked;
                    
                    if (debeReemplazar) {
                        // Reemplazar todos los datos
                        if (backupData.data.operarios) localStorage.setItem('operarios', JSON.stringify(backupData.data.operarios));
                        if (backupData.data.maquinas) localStorage.setItem('maquinas', JSON.stringify(backupData.data.maquinas));
                        if (backupData.data.registros) localStorage.setItem('registros', JSON.stringify(backupData.data.registros));
                        if (backupData.data.configuracion) localStorage.setItem('configuracion', JSON.stringify(backupData.data.configuracion));
                    } else {
                        // Fusionar datos existentes con los importados
                        fusionarDatos('operarios', backupData.data.operarios || []);
                        fusionarDatos('maquinas', backupData.data.maquinas || []);
                        fusionarDatos('registros', backupData.data.registros || []);
                        
                        // Para configuración, mejor usar Object.assign
                        const configActual = JSON.parse(localStorage.getItem('configuracion') || '{}');
                        const configNueva = backupData.data.configuracion || {};
                        localStorage.setItem('configuracion', JSON.stringify(Object.assign(configActual, configNueva)));
                    }
                    
                    alert('Datos importados correctamente. La página se recargará para aplicar los cambios.');
                    window.location.reload();
                    
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    alert('Error al importar datos: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        });
    }
}

// Función auxiliar para fusionar datos
function fusionarDatos(clave, datosNuevos) {
    if (!datosNuevos || !Array.isArray(datosNuevos) || datosNuevos.length === 0) return;
    
    const datosActuales = JSON.parse(localStorage.getItem(clave) || '[]');
    const idsExistentes = new Set(datosActuales.map(item => item.id));
    
    // Filtrar solo elementos nuevos (que no existan ya)
    const elementosNuevos = datosNuevos.filter(item => !idsExistentes.has(item.id));
    
    // Combinar arrays y guardar
    const resultado = [...datosActuales, ...elementosNuevos];
    localStorage.setItem(clave, JSON.stringify(resultado));
}

// Inicializar todos los componentes cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar botones de configuración
    inicializarBtnReiniciarSistema();
    inicializarBtnLimpiarRegistros();
    inicializarBotonesImportacionExportacion();
    
    // Aquí puedes inicializar otros componentes
    // ...existing code...
});

// Asegurarse de que los botones de configuración se inicialicen correctamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes de configuración
    inicializarBtnReiniciarSistema();
    inicializarBtnLimpiarRegistros();
    inicializarBotonesImportacionExportacion();
    
    // Elemento específico para el botón de reinicio del sistema
    const btnReiniciarSistema = document.getElementById('btnReiniciarSistema');
    if (btnReiniciarSistema) {
        console.log('Botón reiniciar sistema encontrado, añadiendo event listener');
        btnReiniciarSistema.addEventListener('click', function() {
            console.log('Botón de reinicio del sistema clickeado');
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
            const nuevoBtn = btnConfirmar.cloneNode(true);
            btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
            
            // Añadir nuevo listener para ejecutar el reinicio
            nuevoBtn.addEventListener('click', function() {
                console.log('Confirmando reinicio del sistema');
                // Lista de claves específicas de la aplicación para borrar
                const keysToRemove = [
                    'operarios',
                    'maquinas',
                    'registros',
                    'configuracion',
                    'produccion',
                    'usuarios',
                    'pedidos',
                    'turnos',
                    'reportes',
                    'ultimosRegistros'
                    // Añadir cualquier otra clave específica que use la aplicación
                ];
                
                // Borrar elementos específicos del localStorage
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                    console.log(`Eliminada clave: ${key}`);
                });
                
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
    } else {
        console.warn('Botón reiniciar sistema no encontrado en el DOM');
    }
});

// ...existing code...
=======
>>>>>>> parent of 60b2399 (Revert "ORganización de funciones")
