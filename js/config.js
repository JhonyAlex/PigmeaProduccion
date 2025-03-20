/**
 * Configuración global del sistema
 * Define si la aplicación funciona en modo estático (GitHub Pages) o con backend PHP
 */
const config = {
    mode: 'static', // Opciones: 'static' o 'php'
    apiBaseUrl: '', // Solo se usa en modo PHP
    version: '1.0.0',
    appName: 'Sistema de Gestión de Producción PIGMEA'
};

// Función para detectar si estamos en GitHub Pages
window.isGitHubPages = function() {
    return location.hostname.includes('github.io') || config.mode === 'static';
};

// Función para obtener URLs correctas según el entorno
window.getUrl = function(path) {
    if (window.isGitHubPages()) {
        // En GitHub Pages, usar rutas relativas
        return path;
    } else {
        // En entorno PHP, quizás necesites una URL base diferente
        return config.apiBaseUrl + path;
    }
};

// Exponer configuración globalmente
window.appConfig = config;
