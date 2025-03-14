    /**
     * Cuenta pedidos por año
     * @param {Array} registros - Lista de registros
     * @param {Map} mapaPedidos - Mapa para contar pedidos
     */
    contarPedidosPorAnio(registros, mapaPedidos) {
        registros.forEach(registro => {
            const operario = registro.operario;
            const maquina = registro.maquina;
            
            if (operario && maquina && mapaPedidos.has(operario) && mapaPedidos.get(operario).has(maquina)) {
                const fecha = new Date(registro.fecha);
                const anioStr = `${fecha.getFullYear()}`;
                const clave = `${anioStr}_${operario}_${maquina}`;
                
                // Verificar si ya contamos este pedido para este año, operario y máquina
                if (!this.pedidosContados) this.pedidosContados = new Set();
                
                if (!this.pedidosContados.has(clave)) {
                    mapaPedidos.get(operario).set(
                        maquina, 
                        mapaPedidos.get(operario).get(maquina) + 1
                    );
                    this.pedidosContados.add(clave);
                }
            }
        });
        
        // Limpiar el conjunto de pedidos contados
        this.pedidosContados = null;
    }
    
    /**
     * Cuenta pedidos por operario
     * @param {Array} registros - Lista de registros
     * @param {Map} mapaPedidos - Mapa para contar pedidos
     */
    contarPedidosPorOperario(registros, mapaPedidos) {
        registros.forEach(registro => {
            const operario = registro.operario;
            const maquina = registro.maquina;
            
            if (operario && maquina && mapaPedidos.has(operario) && mapaPedidos.get(operario).has(maquina)) {
                mapaPedidos.get(operario).set(
                    maquina, 
                    mapaPedidos.get(operario).get(maquina) + 1
                );
            }
        });
    }
    
    /**
     * Cuenta pedidos por turno
     * @param {Array} registros - Lista de registros
     * @param {Map} mapaPedidos - Mapa para contar pedidos
     */
    contarPedidosPorTurno(registros, mapaPedidos) {
        registros.forEach(registro => {
            const operario = registro.operario;
            const maquina = registro.maquina;
            
            if (operario && maquina && mapaPedidos.has(operario) && mapaPedidos.get(operario).has(maquina)) {
                const turno = registro.turno;
                const clave = `${turno}_${operario}_${maquina}`;
                
                // Verificar si ya contamos este pedido para este turno, operario y máquina
                if (!this.pedidosContados) this.pedidosContados = new Set();
                
                if (!this.pedidosContados.has(clave)) {
                    mapaPedidos.get(operario).set(
                        maquina, 
                        mapaPedidos.get(operario).get(maquina) + 1
                    );
                    this.pedidosContados.add(clave);
                }
            }
        });
        
        // Limpiar el conjunto de pedidos contados
        this.pedidosContados = null;
    }
    
    /**
     * Cuenta pedidos por tipo
     * @param {Array} registros - Lista de registros
     * @param {Map} mapaPedidos - Mapa para contar pedidos
     */
    contarPedidosPorTipo(registros, mapaPedidos) {
        registros.forEach(registro => {
            const operario = registro.operario;
            const maquina = registro.maquina;
            
            if (operario && maquina && mapaPedidos.has(operario) && mapaPedidos.get(operario).has(maquina)) {
                const tipo = registro.tipo;
                const clave = `${tipo}_${operario}_${maquina}`;
                
                // Verificar si ya contamos este pedido para este tipo, operario y máquina
                if (!this.pedidosContados) this.pedidosContados = new Set();
                
                if (!this.pedidosContados.has(clave)) {
                    mapaPedidos.get(operario).set(
                        maquina, 
                        mapaPedidos.get(operario).get(maquina) + 1
                    );
                    this.pedidosContados.add(clave);
                }
            }
        });
        
        // Limpiar el conjunto de pedidos contados
        this.pedidosContados = null;
    }
    
    /**
     * Genera los gráficos para la sección de reportes
     * @param {Array} registros - Lista de registros
     * @param {string} agrupacion - Tipo de agrupación
     */
    generarGraficosReportes(registros, agrupacion) {
        // Generar gráfico de producción por operario
        Charts.crearGraficoProduccionPorOperario('produccionPorOperarioChart', registros, agrupacion);
        
        // Generar gráfico de producción por tipo
        Charts.crearGraficoProduccionPorTipo('produccionPorTipoChart', registros);
    }
    
    /**
     * Exporta el reporte actual
     */
    exportarReporteActual() {
        // Obtener datos de la tabla de asesores
        const tabla = document.getElementById('tablaAsesores');
        const filas = tabla.querySelectorAll('tbody tr');
        const datos = [];
        
        // Obtener encabezados
        const encabezados = [];
        tabla.querySelectorAll('thead th').forEach(th => {
            encabezados.push(th.textContent);
        });
        
        // Procesar cada fila
        filas.forEach(fila => {
            const filaDatos = {};
            fila.querySelectorAll('td').forEach((td, index) => {
                filaDatos[encabezados[index]] = td.textContent;
            });
            datos.push(filaDatos);
        });
        
        // Añadir totales
        const totales = {};
        tabla.querySelectorAll('tfoot th').forEach((th, index) => {
            if (index > 0) { // Omitir la primera celda que dice "TOTALES"
                totales[encabezados[index]] = th.textContent;
            } else {
                totales[encabezados[index]] = "TOTALES";
            }
        });
        datos.push(totales);
        
        // Obtener parámetros del reporte para el nombre del archivo
        const desde = document.getElementById('reporteDesde').value;
        const hasta = document.getElementById('reporteHasta').value;
        const nombreArchivo = `reporte_produccion_${desde}_${hasta}.xlsx`;
        
        // Exportar a Excel
        Utils.exportarExcel(datos, nombreArchivo);
    }
    
    /**
     * Inicializa la sección de configuración
     */
    inicializarConfiguracion() {
        // Cargar operarios
        this.cargarTablaOperarios();
        
        // Cargar máquinas
        this.cargarTablaMaquinas();
        
        // Asignar eventos
        document.getElementById('operarioForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarOperario();
        });
        
        document.getElementById('maquinaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarMaquina();
        });
        
        document.getElementById('btnExportarTodo').addEventListener('click', () => {
            this.exportarTodosDatos();
        });
        
        document.getElementById('btnImportarTodo').addEventListener('click', () => {
            this.importarTodosDatos();
        });
        
        document.getElementById('btnLimpiarRegistros').addEventListener('click', () => {
            this.limpiarRegistrosAntiguos();
        });
        
        document.getElementById('btnReiniciarSistema').addEventListener('click', () => {
            this.reiniciarSistema();
        });
    }
    
    /**
     * Carga la tabla de operarios
     */
    cargarTablaOperarios() {
        const tabla = document.getElementById('tablaOperarios').querySelector('tbody');
        tabla.innerHTML = '';
        
        const operarios = Storage.getOperarios();
        
        if (operarios.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = '<td colspan="2" class="text-center">No hay operarios registrados</td>';
            tabla.appendChild(fila);
        } else {
            operarios.forEach(operario => {
                const fila = document.createElement('tr');
                
                fila.innerHTML = `
                    <td>${operario.nombre}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger btnEliminarOperario" data-id="${operario.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                
                tabla.appendChild(fila);
            });
            
            // Asignar evento para eliminar operario
            document.querySelectorAll('.btnEliminarOperario').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.eliminarOperario(id);
                });
            });
        }
    }
    
    /**
     * Carga la tabla de máquinas
     */
    cargarTablaMaquinas() {
        const tabla = document.getElementById('tablaMaquinas').querySelector('tbody');
        tabla.innerHTML = '';
        
        const maquinas = Storage.getMaquinas();
        
        if (maquinas.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = '<td colspan="2" class="text-center">No hay máquinas registradas</td>';
            tabla.appendChild(fila);
        } else {
            maquinas.forEach(maquina => {
                const fila = document.createElement('tr');
                
                fila.innerHTML = `
                    <td>${maquina.nombre}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger btnEliminarMaquina" data-id="${maquina.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                
                tabla.appendChild(fila);
            });
            
            // Asignar evento para eliminar máquina
            document.querySelectorAll('.btnEliminarMaquina').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.eliminarMaquina(id);
                });
            });
        }
    }
    
    /**
     * Agrega un operario
     */
    agregarOperario() {
        const nombreInput = document.getElementById('nombreOperario');
        const nombre = nombreInput.value.trim();
        
        if (!nombre) {
            Utils.mostrarMensaje("Por favor ingresa un nombre para el operario", "warning");
            return;
        }
        
        const operario = new Operario(null, nombre);
        
        if (Storage.agregarOperario(operario)) {
            nombreInput.value = '';
            this.cargarTablaOperarios();
            Utils.mostrarMensaje("Operario agregado correctamente", "success");
            
            // Recargar listas de operarios en toda la aplicación
            this.actualizarListasOperarios();
        } else {
            Utils.mostrarMensaje("Error al agregar operario. Nombre duplicado.", "error");
        }
    }
    
    /**
     * Elimina un operario
     * @param {string} id - ID del operario
     */
    eliminarOperario(id) {
        Utils.confirmarAccion(
            "¿Estás seguro de que deseas eliminar este operario? Esta acción no se puede deshacer.",
            "Eliminar Operario",
            () => {
                if (Storage.eliminarOperario(id)) {
                    this.cargarTablaOperarios();
                    Utils.mostrarMensaje("Operario eliminado correctamente", "success");
                    
                    // Recargar listas de operarios en toda la aplicación
                    this.actualizarListasOperarios();
                } else {
                    Utils.mostrarMensaje("Error al eliminar operario", "error");
                }
            }
        );
    }
    
    /**
     * Agrega una máquina
     */
    agregarMaquina() {
        const nombreInput = document.getElementById('nombreMaquina');
        const nombre = nombreInput.value.trim();
        
        if (!nombre) {
            Utils.mostrarMensaje("Por favor ingresa un nombre para la máquina", "warning");
            return;
        }
        
        const maquina = new Maquina(null, nombre);
        
        if (Storage.agregarMaquina(maquina)) {
            nombreInput.value = '';
            this.cargarTablaMaquinas();
            Utils.mostrarMensaje("Máquina agregada correctamente", "success");
            
            // Recargar listas de máquinas en toda la aplicación
            this.actualizarListasMaquinas();
        } else {
            Utils.mostrarMensaje("Error al agregar máquina. Nombre duplicado.", "error");
        }
    }
    
    /**
     * Elimina una máquina
     * @param {string} id - ID de la máquina
     */
    eliminarMaquina(id) {
        Utils.confirmarAccion(
            "¿Estás seguro de que deseas eliminar esta máquina? Esta acción no se puede deshacer.",
            "Eliminar Máquina",
            () => {
                if (Storage.eliminarMaquina(id)) {
                    this.cargarTablaMaquinas();
                    Utils.mostrarMensaje("Máquina eliminada correctamente", "success");
                    
                    // Recargar listas de máquinas en toda la aplicación
                    this.actualizarListasMaquinas();
                } else {
                    Utils.mostrarMensaje("Error al eliminar máquina", "error");
                }
            }
        );
    }
    
    /**
     * Actualiza todas las listas de operarios en la aplicación
     */
    actualizarListasOperarios() {
        const operarios = Storage.getOperarios();
        
        // Lista en registro
        const selectOperarioReg = document.getElementById('operario');
        if (selectOperarioReg) {
            const valorActual = selectOperarioReg.value;
            selectOperarioReg.innerHTML = '<option value="">Seleccionar...</option>';
            
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.textContent = operario.nombre;
                selectOperarioReg.appendChild(option);
            });
            
            selectOperarioReg.value = valorActual;
        }
        
        // Lista en filtros de base de datos
        const selectOperarioFiltro = document.getElementById('filtroOperario');
        if (selectOperarioFiltro) {
            const valorActual = selectOperarioFiltro.value;
            selectOperarioFiltro.innerHTML = '<option value="">Todos los Operarios</option>';
            
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.textContent = operario.nombre;
                selectOperarioFiltro.appendChild(option);
            });
            
            selectOperarioFiltro.value = valorActual;
        }
        
        // Lista en reportes
        const selectOperarioReporte = document.getElementById('reporteOperario');
        if (selectOperarioReporte) {
            const valorActual = selectOperarioReporte.value;
            selectOperarioReporte.innerHTML = '<option value="">Todos</option>';
            
            operarios.forEach(operario => {
                const option = document.createElement('option');
                option.value = operario.nombre;
                option.textContent = operario.nombre;
                selectOperarioReporte.appendChild(option);
            });
            
            selectOperarioReporte.value = valorActual;
        }
    }
    
    /**
     * Actualiza todas las listas de máquinas en la aplicación
     */
    actualizarListasMaquinas() {
        const maquinas = Storage.getMaquinas();
        
        // Actualizar todas las listas de máquinas en los registros
        const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        diasSemana.forEach(dia => {
            const contenedor = document.getElementById(`registros-${dia}`);
            if (!contenedor) return;
            
            const filas = contenedor.querySelectorAll('.registro-item');
            filas.forEach((fila, index) => {
                const numFila = index + 1;
                const selectMaquina = document.getElementById(`${dia}-maquina-${numFila}`);
                
                if (selectMaquina) {
                    const valorActual = selectMaquina.value;
                    selectMaquina.innerHTML = '<option value="">Seleccionar máquina...</option>';
                    
                    maquinas.forEach(maquina => {
                        const option = document.createElement('option');
                        option.value = maquina.nombre;
                        option.textContent = maquina.nombre;
                        selectMaquina.appendChild(option);
                    });
                    
                    selectMaquina.value = valorActual;
                }
            });
        });
    }
    
    /**
     * Exporta todos los datos del sistema
     */
    exportarTodosDatos() {
        const datos = Storage.exportarTodo();
        
        if (datos) {
            // Crear blob y descargar
            const blob = new Blob([datos], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Crear nombre de archivo con fecha actual
            const fecha = new Date().toISOString().split('T')[0];
            const nombreArchivo = `backup_produccion_${fecha}.json`;
            
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Utils.mostrarMensaje("Datos exportados correctamente", "success");
        } else {
            Utils.mostrarMensaje("Error al exportar datos", "error");
        }
    }
    
    /**
     * Importa todos los datos del sistema
     */
    importarTodosDatos() {
        const fileInput = document.getElementById('importFile');
        const reemplazar = document.getElementById('reemplazarDatos').checked;
        
        if (fileInput.files.length === 0) {
            Utils.mostrarMensaje("Por favor selecciona un archivo para importar", "warning");
            return;
        }
        
        // Verificar extensión
        const archivo = fileInput.files[0];
        if (!archivo.name.toLowerCase().endsWith('.json')) {
            Utils.mostrarMensaje("El archivo debe tener extensión .json", "error");
            return;
        }
        
        // Confirmar antes de importar
        Utils.confirmarAccion(
            `¿Estás seguro de que deseas ${reemplazar ? 'reemplazar todos' : 'importar'} los datos? ${reemplazar ? 'Esta acción no se puede deshacer.' : ''}`,
            "Importar Datos",
            () => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const contenido = e.target.result;
                        
                        if (Storage.importarTodo(contenido, reemplazar)) {
                            Utils.mostrarMensaje("Datos importados correctamente", "success");
                            
                            // Recargar interfaces
                            this.cargarTablaOperarios();
                            this.cargarTablaMaquinas();
                            this.actualizarListasOperarios();
                            this.actualizarListasMaquinas();
                            
                            // Limpiar input
                            fileInput.value = '';
                            document.getElementById('reemplazarDatos').checked = false;
                        } else {
                            Utils.mostrarMensaje("Error al importar datos. Formato incorrecto.", "error");
                        }
                    } catch (error) {
                        console.error('Error al leer el archivo:', error);
                        Utils.mostrarMensaje("Error al leer el archivo", "error");
                    }
                };
                
                reader.readAsText(archivo);
            }
        );
    }
    
    /**
     * Limpia registros antiguos del sistema
     */
    limpiarRegistrosAntiguos() {
        Utils.confirmarAccion(
            "¿Cuántos meses de registros deseas mantener? Los registros más antiguos serán eliminados.",
            "Limpiar Registros Antiguos",
            () => {
                // Crear un input para que el usuario ingrese el número de meses
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                const modalBody = document.getElementById('confirmBody');
                
                modalBody.innerHTML = `
                    <p>¿Cuántos meses de registros deseas mantener? Los registros más antiguos serán eliminados.</p>
                    <div class="mb-3">
                        <input type="number" class="form-control" id="mesesConservar" min="1" value="6">
                    </div>
                `;
                
                // Configurar el botón de confirmar
                const btnConfirmar = document.getElementById('btnConfirmar');
                const oldHandler = btnConfirmar.onclick;
                
                btnConfirmar.onclick = () => {
                    const meses = parseInt(document.getElementById('mesesConservar').value) || 6;
                    this.ejecutarLimpiezaRegistros(meses);
                    modal.hide();
                    
                    // Restaurar manejador original
                    setTimeout(() => {
                        modalBody.innerHTML = "¿Estás seguro de que deseas continuar?";
                        btnConfirmar.onclick = oldHandler;
                    }, 500);
                };
            }
        );
    }
    
    /**
     * Ejecuta la limpieza de registros antiguos
     * @param {number} meses - Número de meses a conservar
     */
    ejecutarLimpiezaRegistros(meses) {
        // Calcular la fecha límite
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - meses);
        
        // Obtener registros
        const registros = Storage.getRegistros();
        const registrosAConservar = registros.filter(registro => 
            new Date(registro.fecha) >= fechaLimite
        );
        
        // Guardar los registros a conservar
        if (Storage.guardarRegistros(registrosAConservar)) {
            const eliminados = registros.length - registrosAConservar.length;
            Utils.mostrarMensaje(`Se eliminaron ${eliminados} registros anteriores a ${Utils.formatoFecha(fechaLimite)}`, "success");
        } else {
            Utils.mostrarMensaje("Error al limpiar registros", "error");
        }
    }
    
    /**
     * Reinicia el sistema completo
     */
    reiniciarSistema() {
        Utils.confirmarAccion(
            "¿Estás seguro de que deseas reiniciar completamente el sistema? Todos los datos serán eliminados y esta acción no se puede deshacer.",
            "Reiniciar Sistema",
            () => {
                if (Storage.reiniciarSistema()) {
                    Utils.mostrarMensaje("El sistema ha sido reiniciado correctamente", "success");
                    
                    // Inicializar datos de demostración
                    Storage.inicializarDatosDemostracion();
                    
                    // Recargar interfaces
                    this.cargarTablaOperarios();
                    this.cargarTablaMaquinas();
                    this.actualizarListasOperarios();
                    this.actualizarListasMaquinas();
                    
                    // Mostrar el dashboard
                    this.mostrarSeccion('dashboard');
                } else {
                    Utils.mostrarMensaje("Error al reiniciar el sistema", "error");
                }
            }
        );
    }
    
    /**
     * Muestra modal para importar datos
     */
    mostrarModalImportarDatos() {
        // En este caso usamos el input file ya presente en la página
        // Solo mostramos un mensaje recordando el formato
        Utils.mostrarMensaje("Selecciona un archivo .json generado por este sistema para importar datos", "info");
    }
    
    /**
     * Inicializa la autenticación de usuario
     */
    inicializarAuth() {
        // Verificar si hay sesión activa
        if (Storage.verificarSesion()) {
            const sesion = Storage.getSesion();
            if (sesion) {
                // Mostrar nombre de usuario
                document.getElementById('currentUser').textContent = sesion.username;
                
                // Mostrar dashboard
                this.mostrarSeccion('dashboard');
                return;
            }
        }
        
        // Si no hay sesión, mostrar formulario de login
        this.mostrarSeccionAuth();
        
        // Configurar eventos para formularios de auth
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarLogin();
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistro();
        });
        
        // Evento para cerrar sesión
        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            this.cerrarSesion();
        });
    }
    
    /**
     * Muestra la sección de autenticación
     */
    mostrarSeccionAuth() {
        // Ocultar todas las secciones
        Object.values(this.sections).forEach(section => {
            if (section) section.classList.add('d-none');
        });
        
        // Mostrar sección de autenticación
        this.sections.auth.classList.remove('d-none');
    }
    
    /**
     * Procesa el formulario de login
     */
    procesarLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            Utils.mostrarMensaje("Por favor completa todos los campos", "warning");
            return;
        }
        
        // Si es la primera ejecución y no hay usuarios, registrar al admin
        if (Storage.getUsuarios().length === 0) {
            const admin = new Usuario(
                null, 
                username, 
                Usuario.hashPassword(password), 
                "admin"
            );
            
            Storage.agregarUsuario(admin);
            
            // Inicializar datos de demostración
            Storage.inicializarDatosDemostracion();
            
            // Guardar sesión y mostrar dashboard
            Storage.guardarSesion(admin);
            document.getElementById('currentUser').textContent = admin.username;
            this.mostrarSeccion('dashboard');
            
            Utils.mostrarMensaje(`Bienvenido ${admin.username}. Se ha creado una cuenta de administrador para ti.`, "success");
            return;
        }
        
        // Verificar credenciales
        const usuario = Storage.verificarCredenciales(username, password);
        
        if (usuario) {
            // Guardar sesión y mostrar dashboard
            Storage.guardarSesion(usuario);
            document.getElementById('currentUser').textContent = usuario.username;
            this.mostrarSeccion('dashboard');
            
            Utils.mostrarMensaje(`Bienvenido ${usuario.username}. 
                                 Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${Utils.obtenerFechaHoraUTC()}
                                 Current User's Login: ${usuario.username}`, "success");
        } else {
            Utils.mostrarMensaje("Credenciales incorrectas", "error");
        }
    }
    
    /**
     * Procesa el formulario de registro
     */
    procesarRegistro() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (!username || !password || !confirmPassword) {
            Utils.mostrarMensaje("Por favor completa todos los campos", "warning");
            return;
        }
        
        if (password !== confirmPassword) {
            Utils.mostrarMensaje("Las contraseñas no coinciden", "warning");
            return;
        }
        
        // Crear usuario
        const usuario = new Usuario(
            null,
            username,
            Usuario.hashPassword(password),
            "usuario"
        );
        
        if (Storage.agregarUsuario(usuario)) {
            // Mostrar mensaje y cambiar a pestaña de login
            Utils.mostrarMensaje(`Usuario ${username} registrado correctamente`, "success");
            
            // Limpiar formulario
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
            
            // Cambiar a pestaña de login
            const loginTab = document.querySelector('#authTabs a[href="#login"]');
            new bootstrap.Tab(loginTab).show();
        } else {
            Utils.mostrarMensaje("El nombre de usuario ya existe", "error");
        }
    }
    
    /**
     * Cierra la sesión del usuario actual
     */
    cerrarSesion() {
        // Cerrar sesión
        Storage.cerrarSesion();
        
        // Mostrar formulario de login
        this    /**
        * Cierra la sesión del usuario actual
        */
       cerrarSesion() {
           // Cerrar sesión
           Storage.cerrarSesion();
           
           // Mostrar formulario de login
           this.mostrarSeccionAuth();
           
           // Limpiar nombre de usuario
           document.getElementById('currentUser').textContent = 'Usuario';
           
           Utils.mostrarMensaje("Has cerrado sesión correctamente", "info");
       }
   }