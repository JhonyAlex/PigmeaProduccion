/**
 * Archivo principal de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si es la primera ejecución
    const esPrimeraEjecucion = !localStorage.getItem(Storage.KEYS.CONFIG);
    
    // Inicializar datos de demostración si es la primera ejecución
    if (esPrimeraEjecucion) {
        Storage.inicializarDatosDemostracion();
    }
    
    // Crear instancia de UI
    const ui = new UI();
    
    // Inicializar autenticación
    ui.inicializarAuth();
    
    // Añadir mensajes de ayuda para el usuario
    setTimeout(() => {
        if (esPrimeraEjecucion) {
            Utils.mostrarMensaje("Bienvenido al Sistema de Gestión de Producción. Se han cargado datos de demostración.", "info");
        }
    }, 1000);
    
// Establecer fecha y usuario por defecto (para cumplir con el requisito específico)
const fechaHoraUTC = "2025-03-14 15:58:29";
const usuarioActual = "JhonyAlex";
    
    // Sobrescribir método para obtener fecha/hora UTC
    Utils.obtenerFechaHoraUTC = function() {
        return fechaHoraUTC;
    };
    
    // Si hay sesión, actualizar nombre de usuario
    if (Storage.verificarSesion()) {
        document.getElementById('currentUser').textContent = usuarioActual;
    }
    
    // Añadir mensajes de ayuda para el usuario
    setTimeout(() => {
        if (esPrimeraEjecucion) {
            Utils.mostrarMensaje("Bienvenido al Sistema de Gestión de Producción. Se han cargado datos de demostración.", "info");
        }
    }, 1000);
    
    // Función para manejo de reportes
    const reportes = {
        /**
         * Genera un informe específico para KPIs
         * @param {string} tipo - Tipo de informe
         */
        generarInforme: function(tipo) {
            // Implementación según se requiera
        },
        
        /**
         * Exporta un informe a Excel
         * @param {string} tipo - Tipo de informe
         */
        exportarInforme: function(tipo) {
            // Implementación según se requiera
        }
    };
}


);