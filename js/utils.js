/**
 * Funciones de utilidad para la aplicación
 */

const Utils = {
    /**
     * Formatea una fecha como string según el formato deseado
     * @param {Date} fecha - Fecha a formatear
     * @param {string} formato - Formato deseado ('fecha', 'hora', 'fechaHora', 'iso')
     * @returns {string} Fecha formateada
     */
    formatoFecha: function(fecha, formato = 'iso') {
        if (!fecha) return '';
        
        // Convertir a objeto Date si es un string
        if (typeof fecha === 'string') {
            fecha = parseISO(fecha);
        }
        
        // Opciones para formatear la fecha
        try {
            switch (formato) {
                case 'fecha':
                    return format(fecha, 'dd/MM/yyyy', { locale: es });
                case 'hora':
                    return format(fecha, 'HH:mm', { locale: es });
                case 'fechaHora':
                    return format(fecha, 'dd/MM/yyyy HH:mm:ss', { locale: es });
                case 'iso':
                    return format(fecha, 'yyyy-MM-dd', { locale: es });
                default:
                    return format(fecha, 'dd/MM/yyyy', { locale: es });
            }
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '';
        }
    },
    
    /**
     * Formatea un número como moneda
     * @param {number} valor - Valor a formatear
     * @param {number} decimales - Número de decimales
     * @returns {string} Valor formateado
     */
    formatoNumero: function(valor, decimales = 2) {
        if (valor === null || valor === undefined) return '';
        
        return Number(valor).toLocaleString('es-ES', {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        });
    },
    
    /**
     * Crear un elemento HTML con atributos
     * @param {string} tag - Nombre de la etiqueta
     * @param {Object} attrs - Atributos del elemento
     * @param {string|HTMLElement} content - Contenido del elemento
     * @returns {HTMLElement} El elemento creado
     */
    crearElemento: function(tag, attrs = {}, content = '') {
        const element = document.createElement(tag);
        
        // Añadir atributos
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Añadir contenido
        if (content) {
            if (typeof content === 'string') {
                element.innerHTML = content;
            } else {
                element.appendChild(content);
            }
        }
        
        return element;
    },
    
    /**
     * Muestra un mensaje de notificación
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} tipo - Tipo de mensaje ('success', 'error', 'info', 'warning')
     */
    mostrarMensaje: function(mensaje, tipo = 'info') {



        const alertas = alertContainer.querySelectorAll('.alert');
        if (alertas.length > 3) {
            alertas[0].remove(); // Eliminar la alerta más antigua
        }









        // Verificar si existe el contenedor de alertas, sino crearlo
        let alertContainer = document.getElementById('alertContainer');
        
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.style.position = 'fixed';
            alertContainer.style.top = '20px';
            alertContainer.style.right = '20px';
            alertContainer.style.zIndex = '9999';
            document.body.appendChild(alertContainer);
        }
        
        // Crear elemento de alerta
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertElement.setAttribute('role', 'alert');
        
        // Agregar icono según tipo
        let icono = '';
        switch (tipo) {
            case 'success':
                icono = '<i class="fas fa-check-circle me-2"></i>';
                break;
            case 'error':
            case 'danger':
                icono = '<i class="fas fa-exclamation-triangle me-2"></i>';
                tipo = 'danger'; // Bootstrap usa 'danger' en lugar de 'error'
                break;
            case 'warning':
                icono = '<i class="fas fa-exclamation-circle me-2"></i>';
                break;
            default:
                icono = '<i class="fas fa-info-circle me-2"></i>';
                break;
        }
        
        alertElement.innerHTML = `
            ${icono}${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Añadir al contenedor
        alertContainer.appendChild(alertElement);
        
        // Autodestruir después de 5 segundos
        setTimeout(() => {
            alertElement.classList.remove('show');
            setTimeout(() => {
                alertElement.remove();
            }, 150);
        }, 5000);
    },
    
    /**
     * Muestra un diálogo de confirmación personalizado
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} titulo - Título del diálogo
     * @param {Function} callback - Función a llamar si se confirma
     */
    confirmarAccion: function(mensaje, titulo, callback) {
        const modal = document.getElementById('confirmModal');
        const modalTitle = document.getElementById('confirmTitle');
        const modalBody = document.getElementById('confirmBody');
        const btnConfirmar = document.getElementById('btnConfirmar');
        
        modalTitle.textContent = titulo || 'Confirmar Acción';
        modalBody.textContent = mensaje;
        
        // Crear nueva instancia de modal
        const bsModal = new bootstrap.Modal(modal);
        
        // Configurar botón de confirmación
        const oldClickHandler = btnConfirmar.onclick;
        btnConfirmar.onclick = () => {
            callback();
            bsModal.hide();
            // Restaurar manejador original
            setTimeout(() => {
                btnConfirmar.onclick = oldClickHandler;
            }, 500);
        };
        
        // Mostrar modal
        bsModal.show();
    },
    
    /**
     * Exporta datos a un archivo Excel
     * @param {Array} datos - Datos a exportar
     * @param {string} nombreArchivo - Nombre del archivo
     */
    exportarExcel: function(datos, nombreArchivo = 'datos_exportados.xlsx') {
        try {
            // Crear workbook
            const wb = XLSX.utils.book_new();
            
            // Crear worksheet
            const ws = XLSX.utils.json_to_sheet(datos);
            
            // Añadir worksheet al workbook
            XLSX.utils.book_append_sheet(wb, ws, "Datos");
            
            // Guardar archivo
            XLSX.writeFile(wb, nombreArchivo);
            
            this.mostrarMensaje('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            this.mostrarMensaje('Error al exportar datos', 'error');
        }
    },
    
    /**
     * Exporta datos a un archivo CSV
     * @param {Array} datos - Datos a exportar
     * @param {string} nombreArchivo - Nombre del archivo
     */
    exportarCSV: function(datos, nombreArchivo = 'datos_exportados.csv') {
        try {
            // Crear workbook
            const wb = XLSX.utils.book_new();
            
            // Crear worksheet
            const ws = XLSX.utils.json_to_sheet(datos);
            
            // Guardar como CSV
            const csv = XLSX.utils.sheet_to_csv(ws);
            
            // Crear enlace para descargar
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            
            link.setAttribute("href", url);
            link.setAttribute("download", nombreArchivo);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.mostrarMensaje('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error al exportar a CSV:', error);
            this.mostrarMensaje('Error al exportar datos', 'error');
        }
    },
    
    /**
     * Obtener el último día del mes
     * @param {number} anio - Año
     * @param {number} mes - Mes (0-11)
     * @returns {number} Último día del mes
     */
    ultimoDiaMes: function(anio, mes) {
        return new Date(anio, mes + 1, 0).getDate();
    },
    
    /**
     * Obtener el nombre del día de la semana
     * @param {Date} fecha - Fecha
     * @returns {string} Nombre del día
     */
    nombreDiaSemana: function(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    },
    
    /**
     * Obtener el nombre del mes
     * @param {Date} fecha - Fecha
     * @returns {string} Nombre del mes
     */
    nombreMes: function(fecha) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                       'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[fecha.getMonth()];
    },
    
    /**
     * Generar colores aleatorios para gráficos
     * @param {number} cantidad - Cantidad de colores
     * @returns {Array} Array de colores
     */
    generarColores: function(cantidad) {
        const colores = [];
        const coloresBase = [
            'rgba(255, 99, 132, 0.7)',   // Rojo
            'rgba(54, 162, 235, 0.7)',   // Azul
            'rgba(255, 206, 86, 0.7)',   // Amarillo
            'rgba(75, 192, 192, 0.7)',   // Verde azulado
            'rgba(153, 102, 255, 0.7)',  // Púrpura
            'rgba(255, 159, 64, 0.7)',   // Naranja
            'rgba(199, 199, 199, 0.7)',  // Gris
            'rgba(83, 102, 255, 0.7)',   // Índigo
            'rgba(255, 99, 255, 0.7)',   // Rosa
            'rgba(99, 255, 132, 0.7)'    // Verde menta
        ];
        
        // Si tenemos suficientes colores base, los usamos
        if (cantidad <= coloresBase.length) {
            return coloresBase.slice(0, cantidad);
        }
        
        // Añadir colores base
        colores.push(...coloresBase);
        
        // Generar colores adicionales
        for (let i = coloresBase.length; i < cantidad; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colores.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
        }
        
        return colores;
    },
    
    /**
     * Obtiene el primer día de la semana para una fecha dada
     * @param {Date} fecha - Fecha 
     * @returns {Date} El primer día (lunes) de esa semana
     */
    obtenerInicioSemana: function(fecha) {
        return startOfWeek(fecha, { locale: es });
    },
    
    /**
     * Obtiene el último día de la semana para una fecha dada
     * @param {Date} fecha - Fecha 
     * @returns {Date} El último día (domingo) de esa semana
     */
    obtenerFinSemana: function(fecha) {
        const inicioSemana = this.obtenerInicioSemana(fecha);
        return endOfWeek(inicioSemana, { locale: es });
    },
    
    /**
     * Genera un ID único
     * @returns {string} ID generado
     */
    generarId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    /**
     * Escapa texto para evitar inyección HTML
     * @param {string} texto - Texto a escapar
     * @returns {string} Texto escapado
     */
    escaparHTML: function(texto) {
        if (!texto) return '';
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    /**
     * Devuelve una fecha formateada como YYYY-MM-DD para inputs tipo date
     * @param {Date} fecha - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    fechaParaInput: function(fecha) {
        if (typeof fecha === 'string') {
            fecha = parseISO(fecha);
        }
        return format(fecha, 'yyyy-MM-dd');
    },
    
    /**
     * Obtiene la fecha actual formateada como string
     * @returns {string} Fecha actual
     */
    fechaActual: function() {
        return this.formatoFecha(new Date(), 'fechaHora');
    },
    
    /**
     * Actualiza la fecha y hora en UTC con formato específico
     * @returns {string} Fecha y hora actual en UTC
     */
    obtenerFechaHoraUTC: function() {
        const fecha = new Date();
        const anio = fecha.getUTCFullYear();
        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getUTCDate()).padStart(2, '0');
        const horas = String(fecha.getUTCHours()).padStart(2, '0');
        const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
        const segundos = String(fecha.getUTCSeconds()).padStart(2, '0');
        
        return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }
};