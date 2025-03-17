/**
 * Gestión de la interfaz de usuario
 */
class UI {
    constructor() {
        // Referencias a elementos de la interfaz
        this.sections = {
            auth: document.getElementById('authSection'),
            dashboard: document.getElementById('dashboardSection'),
            registro: document.getElementById('registroSection'),
            baseDatos: document.getElementById('baseDatosSection'),
            reportes: document.getElementById('reportesSection'),
            configuracion: document.getElementById('configuracionSection')
        };
        
        // Referencias a elementos de navegación
        this.navLinks = document.querySelectorAll('.navbar-nav .nav-link[data-section]');
        
        // Paginación para tabla de datos
        this.paginaActual = 1;
        this.registrosPorPagina = 50;
        this.datosFiltrados = [];
        this.columnaOrden = 'fecha';
        this.ordenAscendente = false;
        
        // Fecha y usuario específicos
        this.fechaHoraUTC = "2025-03-14 15:29:20";
        this.usuarioActual = "JhonyAlex";
        
        // Inicializar evento para navegación
        this.inicializarNavegacion();
    }
    
    /**
     * Inicializa los eventos de navegación entre secciones
     */
    inicializarNavegacion() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const seccion = link.getAttribute('data-section');
                this.mostrarSeccion(seccion);
                
                // Marcar el enlace activo
                this.navLinks.forEach(item => item.classList.remove('active-section'));
                link.classList.add('active-section');
            });
        });
    }
    
    /**
     * Muestra una sección específica y oculta las demás
     * @param {string} seccion - Nombre de la sección a mostrar
     */
    mostrarSeccion(seccion) {
        // Ocultar todas las secciones
        Object.values(this.sections).forEach(section => {
            if (section) section.classList.add('d-none');
        });
        
        // Mostrar la sección solicitada
        if (this.sections[seccion]) {
            this.sections[seccion].classList.remove('d-none');
            
            // Acciones específicas según la sección
            switch (seccion) {
                case 'dashboard':
                    this.actualizarDashboard();
                    break;
                case 'registro':
                    this.inicializarRegistro();
                    break;
                case 'baseDatos':
                    this.cargarTablaBaseDatos();
                    break;
                case 'reportes':
                    this.inicializarReportes();
                    break;
                case 'configuracion':
                    this.inicializarConfiguracion();
                    break;
            }
        }
    }
    
    /**
     * Actualiza los KPIs y gráficos del dashboard
     */
    actualizarDashboard() {
        // Obtener todos los registros
        const registros = Storage.getRegistros();
        
        // Actualizar KPIs principales
        this.actualizarContadoresKPI(registros);
        
        // Cargar últimos pedidos
        this.cargarUltimosPedidos(registros);
        
        // Inicializar gráficos
        this.inicializarGraficosDashboard(registros);
    }
    
    /**
     * Actualiza los contadores de KPI en el dashboard
     * @param {Array} registros - Lista de registros
     */
    actualizarContadoresKPI(registros) {
        // Total de pedidos
        document.getElementById('totalPedidos').textContent = registros.length;
        
        // Total de metros
        const totalMetros = registros.reduce((sum, registro) => sum + parseFloat(registro.metros || 0), 0);
        document.getElementById('totalMetros').textContent = Utils.formatoNumero(totalMetros);
        
        // Total de operarios únicos
        const operariosUnicos = [...new Set(registros.map(r => r.operario).filter(Boolean))];
        document.getElementById('totalOperarios').textContent = operariosUnicos.length;
        
        // Total de turnos únicos
        const turnosUnicos = [...new Set(registros.map(r => r.turno).filter(Boolean))];
        document.getElementById('totalTurnos').textContent = turnosUnicos.length;
    }
    
    /**
     * Carga la tabla de últimos pedidos en el dashboard
     * @param {Array} registros - Lista de registros
     */
    cargarUltimosPedidos(registros) {
        const tabla = document.getElementById('ultimosPedidosTable').querySelector('tbody');
        if (!tabla) return; // Verificación añadida
        
        tabla.innerHTML = '';
        
        // Ordenar por fecha descendente y tomar los últimos 10
        const ultimosRegistros = [...registros]
            .sort((a, b) => b.fecha - a.fecha)
            .slice(0, 10);
        
        ultimosRegistros.forEach(registro => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${Utils.formatoFecha(registro.fecha)}</td>
                <td>${Utils.escaparHTML(registro.numPedido)}</td>
                <td>${Utils.escaparHTML(registro.dia)}</td>
                <td>${Utils.escaparHTML(registro.operario)}</td>
                <td>${Utils.escaparHTML(registro.turno)}</td>
                <td>${Utils.formatoNumero(registro.metros)}</td>
                <td>${Utils.escaparHTML(registro.tipo)}</td>
            `;
            
            tabla.appendChild(fila);
        });
    }
    
    /**
     * Inicializa los gráficos del dashboard
     * @param {Array} registros - Lista de registros
     */
    inicializarGraficosDashboard(registros) {
        try {
            // Configuración del gráfico de pedidos por semana
            Charts.crearGraficoPedidosSemana('pedidosSemanaChart', registros);
            
            // Configuración del gráfico de metros por operario
            Charts.crearGraficoMetrosPorOperario('metrosPorOperarioChart', registros);
        } catch (error) {
            console.error('Error al inicializar gráficos:', error);
            Utils.mostrarMensaje('Error al cargar gráficos', 'error');
        }
    }
    
    /**
     * Inicializa la sección de registro de producción
     */
    inicializarRegistro() {
        try {
            // Inicializar fecha base con la fecha actual (lunes de la semana actual)
            const fechaActual = new Date();
        const lunesSemana = startOfWeek(fechaActual, { locale: es });
            
            // Establecer la fecha base en el campo correspondiente
            const fechaBaseInput = document.getElementById('fechaBase');
            if (fechaBaseInput) {
                fechaBaseInput.value = Utils.fechaParaInput(lunesSemana);
            }
            
            // Cargar operarios en el select
            const selectOperario = document.getElementById('operario');
            if (selectOperario) {
                selectOperario.innerHTML = '<option value="">Seleccionar...</option>';
                
                const operarios = Storage.getOperarios();
                operarios.forEach(operario => {
                    const option = document.createElement('option');
                    option.value = operario.nombre;
                    option.textContent = operario.nombre;
                    selectOperario.appendChild(option);
                });
            }
            
            // Generar contenido para las pestañas de días
            this.generarContenidoPestanasDias();
            
            // Asignar evento al botón de limpiar tabla
            const btnLimpiarTabla = document.getElementById('btnLimpiarTabla');
            if (btnLimpiarTabla) {
                btnLimpiarTabla.addEventListener('click', () => {
                    this.limpiarTablaRegistro();
                });
            }
            
            // Asignar evento al formulario de registro para guardar datos
            const registroForm = document.getElementById('registroForm');
            if (registroForm) {
                registroForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.procesarFormularioRegistro();
                });
            }
        } catch (error) {
            console.error('Error al inicializar registro:', error);
            Utils.mostrarMensaje('Error al inicializar el formulario de registro', 'error');
        }
    }
    
    /**
     * Genera el contenido para las pestañas de días de la semana en el registro
     */
    generarContenidoPestanasDias() {
        const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const contenedor = document.getElementById('diasSemanaContent');
        if (!contenedor) return; // Verificación añadida
        
        contenedor.innerHTML = '';
        
        diasSemana.forEach((dia, index) => {
            // Crear el div de la pestaña
            const tabPane = document.createElement('div');
            tabPane.className = index === 0 ? 'tab-pane fade show active' : 'tab-pane fade';
            tabPane.id = dia;
            
            // Título y fecha del día
            let diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
        if (dia === 'miercoles') diaCapitalizado = 'Miércoles';
        if (dia === 'sabado') diaCapitalizado = 'Sábado';
            
        const fechaDia = this.calcularFechaDia(index); // Lunes = 0, Domingo = 6
            
            // Crear tabla para los registros del día
            const tabla = `
            <div class="registro-dia">
                <div class="row mb-3">
                    <div class="col">
                        <h5>${diaCapitalizado} - <span class="text-muted">${Utils.formatoFecha(fechaDia)}</span></h5>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary btnAgregarFila" data-dia="${dia}">
                            <i class="fas fa-plus me-1"></i>Agregar Fila
                        </button>
                    </div>
                </div>
                
                <div id="registros-${dia}">
                    <!-- Las filas se agregarán dinámicamente -->
                    ${this.generarFilaRegistro(dia, 1)}
                    ${this.generarFilaRegistro(dia, 2)}
                    ${this.generarFilaRegistro(dia, 3)}
                </div>
            </div>
            `;
            
            tabPane.innerHTML = tabla;
            contenedor.appendChild(tabPane);
            
            // Asignar evento al botón de agregar fila
            const btnAgregarFila = tabPane.querySelector('.btnAgregarFila');
            if (btnAgregarFila) {
                btnAgregarFila.addEventListener('click', () => {
                    this.agregarFilaRegistro(dia);
                });
            }
            
            // Asignar eventos a botones de eliminar
            this.asignarEventosEliminarFilas(dia);
        });
    }
    
    /**
     * Asigna eventos a los botones de eliminar fila
     * @param {string} dia - Nombre del día
     */
    asignarEventosEliminarFilas(dia) {
        const contenedor = document.getElementById(`registros-${dia}`);
        if (!contenedor) return;
        
        const botonesEliminar = contenedor.querySelectorAll('.btnEliminarFila');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', () => {
                const numFila = btn.getAttribute('data-num');
                if (numFila) {
                    this.eliminarFilaRegistro(dia, numFila);
                }
            });
        });
    }
    
    /**
     * Genera el HTML para una fila de registro
     * @param {string} dia - Nombre del día
     * @param {number} num - Número de fila
     * @returns {string} HTML de la fila de registro
     */
    generarFilaRegistro(dia, num) {
        return `
        <div class="registro-item" id="${dia}-registro-${num}">
            <div class="row">
                <div class="col-md-6">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <strong>#${num}</strong>
                        </div>
                        <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="${dia}-numPedido-${num}" placeholder="Número de pedido">
                                <label for="${dia}-numPedido-${num}">Número de pedido</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-floating mb-2">
                        <input type="number" class="form-control" id="${dia}-metros-${num}" placeholder="Metros" min="0" step="0.01">
                        <label for="${dia}-metros-${num}">Metros</label>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-floating mb-2">
                        <input type="number" class="form-control" id="${dia}-bandas-${num}" placeholder="Bandas" min="0">
                        <label for="${dia}-bandas-${num}">Bandas</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${dia}-refilado-${num}">
                        <label class="form-check-label" for="${dia}-refilado-${num}">
                            Con refilado
                        </label>
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <select class="form-select" id="${dia}-tipo-${num}">
                        <option value="">Tipo...</option>
                        <option value="Monolámina">Monolámina (M)</option>
                        <option value="Bicapa">Bicapa (B)</option>
                        <option value="Tricapa">Tricapa (T)</option>
                    </select>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="form-floating">
                        <input type="number" class="form-control" id="${dia}-barras-${num}" placeholder="Barras" min="0">
                        <label for="${dia}-barras-${num}">Barras</label>
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${dia}-micro-${num}">
                        <label class="form-check-label" for="${dia}-micro-${num}">
                            Con micro
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <select class="form-select" id="${dia}-maquina-${num}">
                        <option value="">Seleccionar máquina...</option>
                        ${this.generarOpcionesMaquinas()}
                    </select>
                </div>
                <div class="col-md-6 text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger btnEliminarFila" data-dia="${dia}" data-num="${num}">
                        <i class="fas fa-trash-alt me-1"></i>Eliminar
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    
    /**
     * Genera las opciones HTML para el select de máquinas
     * @returns {string} HTML con las opciones de máquinas
     */
    generarOpcionesMaquinas() {
        const maquinas = Storage.getMaquinas();
        if (!maquinas || maquinas.length === 0) return '';
        
        return maquinas.map(maquina => 
            `<option value="${Utils.escaparHTML(maquina.nombre)}">${Utils.escaparHTML(maquina.nombre)}</option>`
        ).join('');
    }
    
    /**
     * Agrega una nueva fila de registro para un día
     * @param {string} dia - Nombre del día
     */
    agregarFilaRegistro(dia) {
        const contenedor = document.getElementById(`registros-${dia}`);
        if (!contenedor) return; // Verificación añadida
        
        // Encontrar el último número de fila
        const filas = contenedor.querySelectorAll('.registro-item');
        const nuevoNum = filas.length + 1;
        
        // Crear el elemento para la nueva fila
        const nuevaFila = document.createElement('div');
        nuevaFila.innerHTML = this.generarFilaRegistro(dia, nuevoNum);
        
        // Agregar la nueva fila al contenedor
        contenedor.appendChild(nuevaFila.firstElementChild);
        
        // Asignar evento al botón de eliminar fila
        const btnEliminar = contenedor.querySelector(`#${dia}-registro-${nuevoNum} .btnEliminarFila`);
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => {
                this.eliminarFilaRegistro(dia, nuevoNum);
            });
        }
    }
    
    /**
     * Elimina una fila de registro
     * @param {string} dia - Nombre del día
     * @param {number} num - Número de fila a eliminar
     */
    eliminarFilaRegistro(dia, num) {
        const fila = document.getElementById(`${dia}-registro-${num}`);
        if (fila) {
            fila.remove();
        }
    }
    
    /**
     * Limpia la tabla de registro (mantiene la fecha base y operario)
     */
    limpiarTablaRegistro() {
        Utils.confirmarAccion(
            "¿Estás seguro de que deseas limpiar toda la tabla de registro?",
            "Confirmar Limpieza",
            () => {
                try {
                    // Mantener fecha, turno y operario
                    const fechaBase = document.getElementById('fechaBase').value;
                    const turno = document.getElementById('turno').value;
                    const operario = document.getElementById('operario').value;
                    
                    // Regenerar contenido de pestañas
                    this.generarContenidoPestanasDias();
                    
                    // Restaurar valores
                    if (document.getElementById('fechaBase')) {
                        document.getElementById('fechaBase').value = fechaBase;
                    }
                    if (document.getElementById('turno')) {
                        document.getElementById('turno').value = turno;
                    }
                    if (document.getElementById('operario')) {
                        document.getElementById('operario').value = operario;
                    }
                    
                    Utils.mostrarMensaje("Tabla de registro limpiada correctamente.", "success");
                } catch (error) {
                    console.error('Error al limpiar tabla:', error);
                    Utils.mostrarMensaje("Error al limpiar la tabla de registro", "error");
                }
            }
        );
    }
    
    /**
     * Calcula la fecha para un día de la semana a partir de la fecha base
     * @param {number} diaSemana - Número del día (1=lunes, 7=domingo)
     * @returns {Date} Fecha calculada
     */
    calcularFechaDia(diaSemana) {
        const fechaBaseInput = document.getElementById('fechaBase');
        if (!fechaBaseInput || !fechaBaseInput.value) return new Date();
        
        const fechaBase = parseISO(fechaBaseInput.value);
        const fechaCalculada = new Date(startOfWeek(fechaBase, { locale: es }));
        fechaCalculada.setDate(fechaCalculada.getDate() + diaSemana);
        return fechaCalculada;
    }
    
    /**
     * Procesa el formulario de registro y guarda los datos
     */
    procesarFormularioRegistro() {
        try {
            // Validar datos generales
            const fechaBaseInput = document.getElementById('fechaBase');
            const turnoInput = document.getElementById('turno');
            const operarioInput = document.getElementById('operario');
            
            if (!fechaBaseInput || !turnoInput || !operarioInput) {
                Utils.mostrarMensaje("Error: Faltan elementos del formulario", "error");
                return;
            }
            
            if (!fechaBaseInput.value || !turnoInput.value || !operarioInput.value) {
                Utils.mostrarMensaje("Por favor completa los datos de fecha, turno y operario", "warning");
                return;
            }
            
            const fechaBase = new Date(fechaBaseInput.value);
            const turno = turnoInput.value;
            const operario = operarioInput.value;
            
            // Procesar cada día de la semana
            const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
            const nuevosRegistros = [];
            const registrosExistentes = [];
            
            // Generar mapa de registros por día
            const mapaRegistrosDia = new Map();
            
            diasSemana.forEach((dia, index) => {
                const diaSemana = index + 1; // 1=lunes, 7=domingo
                const fecha = this.calcularFechaDia(index);

        const nombreDia = format(fecha, 'EEEE', { locale: es });
                const contenedor = document.getElementById(`registros-${dia}`);
                if (!contenedor) return; // Verificación añadida
                
                const filas = contenedor.querySelectorAll('.registro-item');
                let cantPedidosDia = 0;
                
                filas.forEach((fila, filaIndex) => {
                    const numFila = filaIndex + 1;
                    const numPedidoInput = document.getElementById(`${dia}-numPedido-${numFila}`);
                    if (!numPedidoInput) return; // Verificación añadida
                    
                    const numPedido = numPedidoInput.value.trim();
                    
                    // Si no hay número de pedido, saltar esta fila
                    if (!numPedido) return;
                    
                    cantPedidosDia++;
                    
                    // Recoger los demás datos
                    const metrosInput = document.getElementById(`${dia}-metros-${numFila}`);
                    const bandasInput = document.getElementById(`${dia}-bandas-${numFila}`);
                    const refiladoInput = document.getElementById(`${dia}-refilado-${numFila}`);
                    const tipoInput = document.getElementById(`${dia}-tipo-${numFila}`);
                    const barrasInput = document.getElementById(`${dia}-barras-${numFila}`);
                    const microInput = document.getElementById(`${dia}-micro-${numFila}`);
                    const maquinaInput = document.getElementById(`${dia}-maquina-${numFila}`);
                    
                    // Verificar elementos
                    if (!metrosInput || !bandasInput || !refiladoInput || !tipoInput || !barrasInput || !microInput || !maquinaInput) {
                        console.warn(`Faltan elementos para la fila ${numFila} del día ${dia}`);
                        return;
                    }
                    
                    const metros = parseFloat(metrosInput.value) || 0;
                    const bandas = parseInt(bandasInput.value) || 0;
                    const refilado = refiladoInput.checked ? "Con Refilado" : "Sin Refilado";
                    const tipo = tipoInput.value;
                    const barras = parseInt(barrasInput.value) || 0;
                    const micro = microInput.checked ? "Con Micro" : "Sin Micro";
                    const maquina = maquinaInput.value;
                    
                    // Crear objeto de registro
                    const registro = new Registro(
                        null,                   // id (se generará automáticamente)
                        new Date(fecha),        // fecha
                        numPedido,              // numPedido
                        nombreDia,              // dia
                        "",                     // mes (se calculará automáticamente)
                        0,                      // semana (se calculará automáticamente)
                        0,                      // semanaMes (se calculará automáticamente)
                        turno,                  // turno
                        operario,               // operario
                        0,                      // cantPedidosDia (se actualizará después)
                        metros,                 // metros
                        0,                      // totalPedidosSemana (se actualizará después)
                        0,                      // totalMetrosDia (se actualizará después)
                        refilado,               // refilado
                        tipo,                   // tipo
                        barras,                 // barras
                        micro,                  // micro
                        bandas,                 // bandas
                        maquina                 // maquina
                    );
                    
                    // Verificar si ya existe un registro con este número de pedido
                    const registrosExistentes = Storage.getRegistros();
                    const registroExistente = registrosExistentes.find(r => r.numPedido === numPedido);
                    
                    if (registroExistente) {
                        // Añadir a la lista de registros existentes para preguntar al usuario
                        registrosExistentes.push({
                            registro,
                            existente: registroExistente
                        });
                    } else {
                        nuevosRegistros.push(registro);
                    }
                    
                    // Agregar al mapa de registros por día
                    if (!mapaRegistrosDia.has(fecha.toDateString())) {
                        mapaRegistrosDia.set(fecha.toDateString(), []);
                    }
                    mapaRegistrosDia.get(fecha.toDateString()).push(registro);
                });
            });
            
            // Actualizar cantidades por día y totales
            mapaRegistrosDia.forEach((registrosDia, fechaStr) => {
                const cantPedidosDia = registrosDia.length;
                const totalMetrosDia = registrosDia.reduce((sum, r) => sum + r.metros, 0);
                
                registrosDia.forEach(registro => {
                    registro.cantPedidosDia = cantPedidosDia;
                    registro.totalMetrosDia = totalMetrosDia;
                });
            });
            
            // Calcular total de pedidos por semana
            const semanaActual = startOfWeek(fechaBase, { locale: es });
        const registrosSemana = [...nuevosRegistros, ...registrosExistentes.map(r => r.registro)]
            .filter(r => startOfWeek(r.fecha, { locale: es }).getTime() === semanaActual.getTime());
            const totalPedidosSemana = registrosSemana.length;
            
            registrosSemana.forEach(registro => {
                registro.totalPedidosSemana = totalPedidosSemana;
            });
            
            // Guardar primero los nuevos registros
            nuevosRegistros.forEach(registro => {
                Storage.agregarRegistro(registro);
            });
            
            // Procesar los registros existentes
            if (registrosExistentes.length > 0) {
                this.manejarRegistrosDuplicados(registrosExistentes, () => {
                    this.mostrarMensajeExito(nuevosRegistros.length + registrosExistentes.length);
                    this.limpiarTablaRegistro();
                });
            } else if (nuevosRegistros.length > 0) {
                this.mostrarMensajeExito(nuevosRegistros.length);
                this.limpiarTablaRegistro();
            } else {
                Utils.mostrarMensaje("No se encontraron datos para guardar", "warning");
            }
        } catch (error) {
            console.error('Error al procesar formulario:', error);
            Utils.mostrarMensaje("Error al procesar el formulario: " + error.message, "error");
        }
    }
    
   
                                    /**
     * Muestra el mensaje de éxito con formato específico
     * @param {number} cantidadRegistros - Cantidad de registros procesados
     */
                                        mostrarMensajeExito(cantidadRegistros) {
                                            Utils.mostrarMensaje(`Datos guardados correctamente.
                                                                Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-03-14 15:35:38
                                                                Current User's Login: JhonyAlex
                                                                Se procesaron ${cantidadRegistros} registro(s) correctamente.`, 
                                                            "success");
                                    }
    
    /**
     * Maneja los registros duplicados y pregunta al usuario qué hacer
     * @param {Array} registrosDuplicados - Lista de objetos {registro, existente}
     * @param {Function} callback - Función a ejecutar al terminar
     */
    manejarRegistrosDuplicados(registrosDuplicados, callback) {
        if (registrosDuplicados.length === 0) {
            if (callback) callback();
            return;
        }
        
        const { registro, existente } = registrosDuplicados[0];
        
        // Preguntar qué hacer con este registro
        Utils.confirmarAccion(
            `El número de pedido ${registro.numPedido} ya existe. ¿Qué deseas hacer?
             - Sí: Editar el registro existente
             - No: Duplicar el registro con nuevos valores
             - Cancelar: Detener el proceso`,
            "Pedido Duplicado",
            () => {
                // Editar el registro existente (conservar el ID)
                registro.id = existente.id;
                Storage.actualizarRegistro(registro);
                
                // Procesar el siguiente registro duplicado
                this.manejarRegistrosDuplicados(registrosDuplicados.slice(1), callback);
            }
        );
        
        // Configurar botón No para duplicar
        const btnNo = document.querySelector('#confirmModal .btn-secondary');
        if (btnNo) {
            btnNo.textContent = "Duplicar";
            btnNo.classList.remove('btn-secondary');
            btnNo.classList.add('btn-success');
            
            // Guardar el handler original
            const originalHandler = btnNo.onclick;
            
            btnNo.onclick = () => {
                // Crear un nuevo registro con nuevo ID
                Storage.agregarRegistro(registro);
                
                // Ocultar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                modal.hide();
                
                // Procesar el siguiente registro duplicado
                setTimeout(() => {
                    this.manejarRegistrosDuplicados(registrosDuplicados.slice(1), callback);
                    
                    // Restaurar el botón
                    btnNo.textContent = "Cancelar";
                    btnNo.classList.remove('btn-success');
                    btnNo.classList.add('btn-secondary');
                    btnNo.onclick = originalHandler;
                }, 500);
            };
        }
    }}