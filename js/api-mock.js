/**
 * Este archivo simula respuestas de un servidor PHP cuando se ejecuta en GitHub Pages
 * o en un entorno estático sin backend
 */
class ApiMock {
    constructor() {
        this.endpoints = {
            'get-data': this.getData,
            'save-data': this.saveData,
            'login': this.login,
            'register': this.register
            // Agrega más endpoints según sea necesario
        };
    }

    /**
     * Intercepta las llamadas fetch y simula respuestas del servidor
     */
    init() {
        // Solo interceptar en modo estático
        if (!window.isGitHubPages()) return;
        
        // Guardar la referencia original de fetch
        const originalFetch = window.fetch;
        
        // Reemplazar fetch con nuestra versión
        window.fetch = async (url, options = {}) => {
            console.log(`Mock API: Interceptando llamada a ${url}`);
            
            // Extraer el endpoint de la URL
            const urlObj = new URL(url, window.location.origin);
            const endpoint = urlObj.pathname.split('/').pop();
            
            // Si tenemos un handler para este endpoint, procesarlo
            if (this.endpoints[endpoint]) {
                // Extraer datos del cuerpo de la solicitud
                let requestData = {};
                if (options.body) {
                    try {
                        requestData = JSON.parse(options.body);
                    } catch (e) {
                        // Intentar procesar como FormData o URLSearchParams
                        const formData = new URLSearchParams(options.body);
                        formData.forEach((value, key) => {
                            requestData[key] = value;
                        });
                    }
                }
                
                // Simular retraso de red
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Llamar al handler correspondiente
                const responseData = this.endpoints[endpoint](requestData);
                
                // Crear una respuesta simulada
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(responseData)
                });
            }
            
            // Si no reconocemos el endpoint, pasar la llamada al fetch original
            return originalFetch(url, options);
        };
        
        console.log('Mock API inicializada - funcionando en modo estático para GitHub Pages');
    }
    
    // Implementaciones de los endpoints simulados
    
    getData(params) {
        // Devolver datos desde localStorage
        const storageKey = params.type || 'data';
        return {
            success: true,
            data: JSON.parse(localStorage.getItem(storageKey) || '[]')
        };
    }
    
    saveData(data) {
        // Guardar datos en localStorage
        const storageKey = data.type || 'data';
        localStorage.setItem(storageKey, JSON.stringify(data.items || []));
        return {
            success: true,
            message: 'Datos guardados correctamente'
        };
    }
    
    login(credentials) {
        // Simulación básica de login
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
            u.username === credentials.username && 
            u.password === credentials.password
        );
        
        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name
                },
                token: 'mock-token-' + Date.now()
            };
        } else {
            return {
                success: false,
                message: 'Credenciales incorrectas'
            };
        }
    }
    
    register(userData) {
        // Simulación básica de registro
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificar si el usuario ya existe
        if (users.some(u => u.username === userData.username)) {
            return {
                success: false,
                message: 'El nombre de usuario ya está en uso'
            };
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            password: userData.password,
            name: userData.name || userData.username
        };
        
        // Guardar en localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name
            }
        };
    }
}

// Inicializar la API mock cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const apiMock = new ApiMock();
    apiMock.init();
});
