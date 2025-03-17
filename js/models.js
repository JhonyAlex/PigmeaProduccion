/**
 * Modelo de datos para la aplicación
 */

// Modelo para registro de producción
class Registro {
    constructor(
        id = null,
        fecha = new Date(),
        numPedido = "",
        dia = "",
        mes = "",
        semana = 0,
        semanaMes = 0,
        turno = "",
        operario = "",
        cantPedidosDia = 0,
        metros = 0,
        totalPedidosSemana = 0,
        totalMetrosDia = 0,
        refilado = "Sin Refilado",
        tipo = "",
        barras = 0,
        micro = "Sin Micro",
        bandas = 0,
        maquina = ""
    ) {
        this.id = id || window.crypto.randomUUID();
        this.fecha = fecha instanceof Date ? fecha : parseISO(fecha); // Asegurarse de analizar la fecha
        this.numPedido = numPedido;
        this.dia = dia || this.getDiaSemana(this.fecha);
        this.mes = mes || this.getMes(this.fecha);
        this.semana = semana || this.getSemanaAnio(this.fecha);
        this.semanaMes = semanaMes || this.getSemanaMes(this.fecha);
        this.turno = turno;
        this.operario = operario;
        this.cantPedidosDia = cantPedidosDia;
        this.metros = parseFloat(metros) || 0;
        this.totalPedidosSemana = totalPedidosSemana;
        this.totalMetrosDia = totalMetrosDia;
        this.refilado = refilado;
        this.tipo = tipo;
        this.barras = parseInt(barras) || 0;
        this.micro = micro;
        this.bandas = parseInt(bandas) || 0;
        this.maquina = maquina;
    }

    // Obtiene el día de la semana en formato texto
    getDiaSemana(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[getDay(fecha)];
    }

    // Obtiene el mes en formato texto
    getMes(fecha) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[getMonth(fecha)];
    }

    // Obtiene la semana del año
    getSemanaAnio(fecha) {
        return getWeek(fecha, { locale: es });
    }

    // Obtiene la semana del mes
    getSemanaMes(fecha) {
        return getWeekOfMonth(fecha, { locale: es });
    }

    // Calcula la fecha a partir de un día de semana y una fecha base
    static calcularFecha(fechaBase, diaSemana) {
        const diasSemanaMap = { 'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6 };
        const diaNumero = diasSemanaMap[diaSemana.toLowerCase()];

        if (diaNumero === undefined) return null;

        const fechaBaseDate = fechaBase instanceof Date ? fechaBase : parseISO(fechaBase);
        const diaBaseNumero = getDay(fechaBaseDate);

        let diferenciaDias = diaNumero - diaBaseNumero;
        if (diferenciaDias < 0) {
            diferenciaDias += 7;
        }

        const fechaCalculada = new Date(fechaBaseDate);
        fechaCalculada.setDate(fechaCalculada.getDate() + diferenciaDias);
        return fechaCalculada;
    }

    // Obtiene el lunes de la semana de una fecha
    static obtenerLunesDeLaSemana(fecha) {
        return startOfWeek(fecha, { locale: es });
    }

    // Crea una instancia a partir de un objeto plano
    static fromObject(obj) {
        return new Registro(
            obj.id,
            new Date(obj.fecha),
            obj.numPedido,
            obj.dia,
            obj.mes,
            obj.semana,
            obj.semanaMes,
            obj.turno,
            obj.operario,
            obj.cantPedidosDia,
            obj.metros,
            obj.totalPedidosSemana,
            obj.totalMetrosDia,
            obj.refilado,
            obj.tipo,
            obj.barras,
            obj.micro,
            obj.bandas,
            obj.maquina
        );
    }
}

// Modelo para operario
class Operario {
    constructor(id = null, nombre = "") {
        this.id = id || crypto.randomUUID();
        this.nombre = nombre;
    }
}

// Modelo para máquina
class Maquina {
    constructor(id = null, nombre = "") {
        this.id = id || crypto.randomUUID();
        this.nombre = nombre;
    }
}

// Modelo para usuario del sistema
class Usuario {
    constructor(id = null, username = "", passwordHash = "", rol = "usuario") {
        this.id = id || crypto.randomUUID();
        this.username = username;
        this.passwordHash = passwordHash;
        this.rol = rol; // admin, usuario
        this.fechaCreacion = new Date();
        this.ultimoAcceso = null;
    }
    
    // Método para verificar la contraseña (simplificado para demo)
    verificarPassword(password) {
        // En una aplicación real, usaríamos bcrypt o similar
        return this.passwordHash === this.hashPassword(password);
    }
    
    // Método para hashear la contraseña (simplificado para demo)
    static hashPassword(password) {
        // En una aplicación real, usaríamos bcrypt o similar
        // Esto es solo una simulación simple para la demo
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0; // Convierte a entero de 32 bits
        }
        return hash.toString();
    }
}

// Modelo para configuración del sistema
class Configuracion {
    constructor() {
        this.version = "1.0.0";
        this.ultimaFechaBackup = null;
        this.ultimoUsuario = null;
        this.colorTema = "primary";
        this.limiteRegistrosPagina = 50;
    }
}