/**
 * Gestión del almacenamiento local (localStorage)
 */
class Storage {
    static KEYS = {
        REGISTROS: 'produccion_registros',
        OPERARIOS: 'produccion_operarios',
        MAQUINAS: 'produccion_maquinas',
        USUARIOS: 'produccion_usuarios',
        CONFIG: 'produccion_config',
        SESION: 'produccion_sesion'
    };

    // Métodos para registros
    static getRegistros() {
        const datos = localStorage.getItem(this.KEYS.REGISTROS);
        if (!datos) return [];
        
        try {
            const registrosObjetos = JSON.parse(datos);
            // Convertir los objetos planos a instancias de la clase Registro
            return registrosObjetos.map(obj => Registro.fromObject(obj));
        } catch (error) {
            console.error('Error al obtener registros:', error);
            return [];
        }
    }

    static guardarRegistros(registros) {
        try {
            localStorage.setItem(this.KEYS.REGISTROS, JSON.stringify(registros));
            return true;
        } catch (error) {
            console.error('Error al guardar registros:', error);
            return false;
        }
    }

    static agregarRegistro(registro) {
        const registros = this.getRegistros();
        registros.push(registro);
        return this.guardarRegistros(registros);
    }

    static actualizarRegistro(registro) {
        const registros = this.getRegistros();
        const index = registros.findIndex(r => r.id === registro.id);
        
        if (index !== -1) {
            registros[index] = registro;
            return this.guardarRegistros(registros);
        }
        return false;
    }

    static eliminarRegistro(id) {
        const registros = this.getRegistros();
        const nuevosRegistros = registros.filter(registro => registro.id !== id);
        
        if (nuevosRegistros.length < registros.length) {
            return this.guardarRegistros(nuevosRegistros);
        }
        return false;
    }

    // Métodos para operarios
    static getOperarios() {
        const datos = localStorage.getItem(this.KEYS.OPERARIOS);
        if (!datos) return [];
        
        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error('Error al obtener operarios:', error);
            return [];
        }
    }

    static guardarOperarios(operarios) {
        try {
            localStorage.setItem(this.KEYS.OPERARIOS, JSON.stringify(operarios));
            return true;
        } catch (error) {
            console.error('Error al guardar operarios:', error);
            return false;
        }
    }

    static agregarOperario(operario) {
        const operarios = this.getOperarios();
        
        // Verificar si ya existe un operario con el mismo nombre
        if (operarios.some(o => o.nombre === operario.nombre)) {
            return false;
        }
        
        operarios.push(operario);
        return this.guardarOperarios(operarios);
    }

    static eliminarOperario(id) {
        const operarios = this.getOperarios();
        const nuevosOperarios = operarios.filter(operario => operario.id !== id);
        
        if (nuevosOperarios.length < operarios.length) {
            return this.guardarOperarios(nuevosOperarios);
        }
        return false;
    }

    // Métodos para máquinas
    static getMaquinas() {
        const datos = localStorage.getItem(this.KEYS.MAQUINAS);
        if (!datos) return [];
        
        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error('Error al obtener máquinas:', error);
            return [];
        }
    }

    static guardarMaquinas(maquinas) {
        try {
            localStorage.setItem(this.KEYS.MAQUINAS, JSON.stringify(maquinas));
            return true;
        } catch (error) {
            console.error('Error al guardar máquinas:', error);
            return false;
        }
    }

    static agregarMaquina(maquina) {
        const maquinas = this.getMaquinas();
        
        // Verificar si ya existe una máquina con el mismo nombre
        if (maquinas.some(m => m.nombre === maquina.nombre)) {
            return false;
        }
        
        maquinas.push(maquina);
        return this.guardarMaquinas(maquinas);
    }

    static eliminarMaquina(id) {
        const maquinas = this.getMaquinas();
        const nuevasMaquinas = maquinas.filter(maquina => maquina.id !== id);
        
        if (nuevasMaquinas.length < maquinas.length) {
            return this.guardarMaquinas(nuevasMaquinas);
        }
        return false;
    }

    // Métodos para usuarios
    static getUsuarios() {
        const datos = localStorage.getItem(this.KEYS.USUARIOS);
        if (!datos) return [];
        
        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    static guardarUsuarios(usuarios) {
        try {
            localStorage.setItem(this.KEYS.USUARIOS, JSON.stringify(usuarios));
            return true;
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
            return false;
        }
    }

    static agregarUsuario(usuario) {
        const usuarios = this.getUsuarios();
        
        // Verificar si ya existe un usuario con el mismo nombre
        if (usuarios.some(u => u.username === usuario.username)) {
            return false;
        }
        
        usuarios.push(usuario);
        return this.guardarUsuarios(usuarios);
    }

    static obtenerUsuarioPorUsername(username) {
        const usuarios = this.getUsuarios();
        return usuarios.find(u => u.username === username) || null;
    }

    static verificarCredenciales(username, password) {
        const usuario = this.obtenerUsuarioPorUsername(username);
        if (!usuario) return null;
        
        // Verificar la contraseña
        if (usuario.passwordHash === Usuario.hashPassword(password)) {
            usuario.ultimoAcceso = new Date();
            this.actualizarUsuario(usuario);
            return usuario;
        }
        
        return null;
    }

    static actualizarUsuario(usuario) {
        const usuarios = this.getUsuarios();
        const index = usuarios.findIndex(u => u.id === usuario.id);
        
        if (index !== -1) {
            usuarios[index] = usuario;
            return this.guardarUsuarios(usuarios);
        }
        return false;
    }

    // Métodos para configuración
    static getConfiguracion() {
        const datos = localStorage.getItem(this.KEYS.CONFIG);
        if (!datos) return new Configuracion();
        
        try {
            const config = JSON.parse(datos);
            return {...new Configuracion(), ...config};
        } catch (error) {
            console.error('Error al obtener configuración:', error);
            return new Configuracion();
        }
    }

    static guardarConfiguracion(config) {
        try {
            localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            return false;
        }
    }

    // Métodos para sesión
    static guardarSesion(usuario) {
        try {
            // Guardamos solo el ID y nombre de usuario por seguridad
            const sesionData = {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(this.KEYS.SESION, JSON.stringify(sesionData));
            
            // Actualizamos la configuración con el último usuario
            const config = this.getConfiguracion();
            config.ultimoUsuario = usuario.username;
            this.guardarConfiguracion(config);
            
            return true;
        } catch (error) {
            console.error('Error al guardar sesión:', error);
            return false;
        }
    }

    static getSesion() {
        const datos = localStorage.getItem(this.KEYS.SESION);
        if (!datos) return null;
        
        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error('Error al obtener sesión:', error);
            return null;
        }
    }

    static cerrarSesion() {
        localStorage.removeItem(this.KEYS.SESION);
    }

    static verificarSesion() {
        const sesion = this.getSesion();
        if (!sesion) return false;
        
        // Verificar si la sesión ha expirado (24 horas)
        const ahora = new Date();
        const timestamp = new Date(sesion.timestamp);
        const diff = ahora - timestamp;
        const horas = diff / (1000 * 60 * 60);
        
        return horas < 24;
    }

    // Métodos para exportar/importar datos
    static exportarTodo() {
        try {
            const datos = {
                registros: this.getRegistros(),
                operarios: this.getOperarios(),
                maquinas: this.getMaquinas(),
                config: this.getConfiguracion(),
                version: "1.0.0",
                fecha: new Date().toISOString()
            };
            
            // Actualizar fecha de último backup
            const config = this.getConfiguracion();
            config.ultimaFechaBackup = new Date().toISOString();
            this.guardarConfiguracion(config);
            
            return JSON.stringify(datos, null, 2);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            return null;
        }
    }

    static importarTodo(datosJSON, reemplazar = false) {
        try {
            const datos = JSON.parse(datosJSON);
            
            // Verificar versión y estructura
            if (!datos.version || !datos.registros || !datos.operarios || !datos.maquinas) {
                throw new Error('Formato de datos inválido');
            }
            
            // Importar datos según la opción seleccionada
            if (reemplazar) {
                // Reemplaza todos los datos
                this.guardarRegistros(datos.registros);
                this.guardarOperarios(datos.operarios);
                this.guardarMaquinas(datos.maquinas);
                
                // Conservar usuarios y mezclar configuración
                const configActual = this.getConfiguracion();
                this.guardarConfiguracion({...datos.config, ultimoUsuario: configActual.ultimoUsuario});
            } else {
                // Añadir datos (evitar duplicados)
                const registrosActuales = this.getRegistros();
                const operariosActuales = this.getOperarios();
                const maquinasActuales = this.getMaquinas();
                
                // Importar registros no duplicados
                const idsActuales = new Set(registrosActuales.map(r => r.id));
                const nuevosRegistros = datos.registros.filter(r => !idsActuales.has(r.id));
                this.guardarRegistros([...registrosActuales, ...nuevosRegistros]);
                
                // Importar operarios no duplicados
                const operariosNombres = new Set(operariosActuales.map(o => o.nombre));
                const nuevosOperarios = datos.operarios.filter(o => !operariosNombres.has(o.nombre));
                this.guardarOperarios([...operariosActuales, ...nuevosOperarios]);
                
                // Importar máquinas no duplicadas
                const maquinasNombres = new Set(maquinasActuales.map(m => m.nombre));
                const nuevasMaquinas = datos.maquinas.filter(m => !maquinasNombres.has(m.nombre));
                this.guardarMaquinas([...maquinasActuales, ...nuevasMaquinas]);
            }
            
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    // Método para inicializar datos de demostración
    static inicializarDatosDemostracion() {
        // Operarios de demostración
        const operarios = [
            new Operario(null, "Juan Pérez"),
            new Operario(null, "María Gómez"),
            new Operario(null, "Carlos Rodríguez"),
            new Operario(null, "Ana Martínez"),
            new Operario(null, "Luis Sánchez")
        ];
        
        // Máquinas de demostración
        const maquinas = [
            new Maquina(null, "Máquina 01"),
            new Maquina(null, "Máquina 02"),
            new Maquina(null, "Máquina 03"),
            new Maquina(null, "Máquina 04")
        ];
        
        // Usuario administrador
        const admin = new Usuario(
            null, 
            "admin", 
            Usuario.hashPassword("admin123"), 
            "admin"
        );
        
        // Usuario normal (JhonyAlex)
        const jhonyalex = new Usuario(
            null, 
            "JhonyAlex", 
            Usuario.hashPassword("password"), 
            "usuario"
        );
        
        // Guardar datos iniciales
        this.guardarOperarios(operarios);
        this.guardarMaquinas(maquinas);
        this.guardarUsuarios([admin, jhonyalex]);
        
        // Crear algunos registros de demostración
        const fechaBase = new Date();
        fechaBase.setDate(fechaBase.getDate() - 14); // Dos semanas atrás
        
        const registros = [];
        const tipos = ["Monolámina", "Bicapa", "Tricapa"];
        const refilados = ["Con Refilado", "Sin Refilado"];
        const micros = ["Con Micro", "Sin Micro"];
        const turnos = ["Mañana", "Tarde", "Noche"];
        
        // Generar registros para las últimas dos semanas
        for (let i = 0; i < 14; i++) {
            const fecha = new Date(fechaBase);
            fecha.setDate(fecha.getDate() + i);
            
            // Entre 3 y 6 registros por día
            const numRegistros = Math.floor(Math.random() * 4) + 3;
            
            for (let j = 1; j <= numRegistros; j++) {
                const operario = operarios[Math.floor(Math.random() * operarios.length)];
                const maquina = maquinas[Math.floor(Math.random() * maquinas.length)];
                const turno = turnos[Math.floor(Math.random() * turnos.length)];
                const tipo = tipos[Math.floor(Math.random() * tipos.length)];
                const refilado = refilados[Math.floor(Math.random() * refilados.length)];
                const micro = micros[Math.floor(Math.random() * micros.length)];
                
                const registro = new Registro(
                    null,
                    new Date(fecha),
                    `P${String(1000 + Math.floor(Math.random() * 9000))}`,
                    "", // día (se calcula automáticamente)
                    "", // mes (se calcula automáticamente)
                    0,  // semana (se calcula automáticamente)
                    0,  // semanaMes (se calcula automáticamente)
                    turno,
                    operario.nombre,
                    j, // cantPedidosDia
                    Math.floor(Math.random() * 1000) + 100, // metros
                    numRegistros, // totalPedidosSemana
                    0, // totalMetrosDia (se calculará después)
                    refilado,
                    tipo,
                    Math.floor(Math.random() * 20) + 1, // barras
                    micro,
                    Math.floor(Math.random() * 50) + 5, // bandas
                    maquina.nombre
                );
                
                registros.push(registro);
            }
        }
        
        // Calcular totales para metros por día
        const fechasUnicas = [...new Set(registros.map(r => r.fecha.toDateString()))];
        fechasUnicas.forEach(fechaStr => {
            const registrosDia = registros.filter(r => r.fecha.toDateString() === fechaStr);
            const totalMetrosDia = registrosDia.reduce((sum, r) => sum + r.metros, 0);
            
            registrosDia.forEach(r => {
                r.totalMetrosDia = totalMetrosDia;
            });
        });
        
        this.guardarRegistros(registros);
        
        // Inicializar configuración
        const config = new Configuracion();
        config.ultimoUsuario = "JhonyAlex";
        config.ultimaFechaBackup = new Date().toISOString();
        this.guardarConfiguracion(config);
        
        return true;
    }

    // Método para limpiar todos los datos
    static reiniciarSistema() {
        localStorage.removeItem(this.KEYS.REGISTROS);
        localStorage.removeItem(this.KEYS.OPERARIOS);
        localStorage.removeItem(this.KEYS.MAQUINAS);
        localStorage.removeItem(this.KEYS.CONFIG);
        // No eliminamos usuarios para mantener acceso
        return true;
    }
}