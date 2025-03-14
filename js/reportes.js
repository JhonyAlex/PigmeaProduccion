/**
 * Funcionalidades específicas para reportes y KPIs
 */
class Reportes {
    /**
     * Genera un reporte de producción según filtros
     * @param {Object} filtros - Filtros aplicados
     * @returns {Object} Datos del reporte
     */
    static generarReporteProduccion(filtros) {
        // Obtener registros
        let registros = Storage.getRegistros();
        
        // Aplicar filtros
        if (filtros.desde) {
            registros = registros.filter(r => new Date(r.fecha) >= new Date(filtros.desde));
        }
        
        if (filtros.hasta) {
            const fechaHasta = new Date(filtros.hasta);
            fechaHasta.setHours(23, 59, 59, 999);
            registros = registros.filter(r => new Date(r.fecha) <= fechaHasta);
        }
        
        if (filtros.operario) {
            registros = registros.filter(r => r.operario === filtros.operario);
        }
        
        if (filtros.turno) {
            registros = registros.filter(r => r.turno === filtros.turno);
        }
        
        if (filtros.tipo) {
            registros = registros.filter(r => r.tipo === filtros.tipo);
        }
        
        // Generar resumen
        const resumen = this.generarResumen(registros);
        
        // Agrupar datos según criterio
        const datos = this.agruparDatos(registros, filtros.agrupacion || 'semana');
        
        return {
            filtros: filtros,
            resumen: resumen,
            datos: datos
        };
    }
    
    /**
     * Genera un resumen de registros
     * @param {Array} registros - Lista de registros
     * @returns {Object} Resumen generado
     */
    static generarResumen(registros) {
        return {
            totalRegistros: registros.length,
            totalMetros: registros.reduce((sum, r) => sum + parseFloat(r.metros || 0), 0),
            totalBandas: registros.reduce((sum, r) => sum + parseInt(r.bandas || 0), 0),
            totalBarras: registros.reduce((sum, r) => sum + parseInt(r.barras || 0), 0),
            operariosUnicos: [...new Set(registros.map(r => r.operario).filter(Boolean))].length,
            maquinasUnicas: [...new Set(registros.map(r => r.maquina).filter(Boolean))].length,
            fechaInicio: registros.length ? new Date(Math.min(...registros.map(r => new Date(r.fecha)))) : null,
            fechaFin: registros.length ? new Date(Math.max(...registros.map(r => new Date(r.fecha)))) : null
        };
    }
    
    /**
     * Agrupa datos según un criterio específico
     * @param {Array} registros - Lista de registros
     * @param {string} criterio - Criterio de agrupación
     * @returns {Array} Datos agrupados
     */
    static agruparDatos(registros, criterio) {
        switch (criterio) {
            case 'dia':
                return this.agruparPorDia(registros);
            case 'semana':
                return this.agruparPorSemana(registros);
            case 'mes':
                return this.agruparPorMes(registros);
            case 'anio':
                return this.agruparPorAnio(registros);
            case 'operario':
                return this.agruparPorOperario(registros);
            case 'turno':
                return this.agruparPorTurno(registros);
            case 'maquina':
                return this.agruparPorMaquina(registros);
            case 'tipo':
                return this.agruparPorTipo(registros);
            default:
                return this.agruparPorSemana(registros);
        }
    }
    
    /**
     * Agrupa registros por día
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por día
     */
    static agruparPorDia(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const fecha = new Date(registro.fecha);
            const clave = fecha.toISOString().split('T')[0];
            
            if (!grupos[clave]) {
                grupos[clave] = {
                    fecha: fecha,
                    etiqueta: Utils.formatoFecha(fecha),
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0
                };
            }
            
            grupos[clave].registros.push(registro);
            grupos[clave].totalMetros += parseFloat(registro.metros || 0);
            grupos[clave].totalPedidos++;
            grupos[clave].totalBandas += parseInt(registro.bandas || 0);
            grupos[clave].totalBarras += parseInt(registro.barras || 0);
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.fecha - b.fecha);
    }
    
    /**
     * Agrupa registros por semana
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por semana
     */
    static agruparPorSemana(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const fecha = new Date(registro.fecha);
            const anio = fecha.getFullYear();
            const semana = registro.semana || 1;
            const clave = `${anio}-S${semana}`;
            
            if (!grupos[clave]) {
                grupos[clave] = {
                    etiqueta: clave,
                    anio: anio,
                    semana: semana,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0
                };
            }
            
            grupos[clave].registros.push(registro);
            grupos[clave].totalMetros += parseFloat(registro.metros || 0);
            grupos[clave].totalPedidos++;
            grupos[clave].totalBandas += parseInt(registro.bandas || 0);
            grupos[clave].totalBarras += parseInt(registro.barras || 0);
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => {
            if (a.anio !== b.anio) return a.anio - b.anio;
            return a.semana - b.semana;
        });
    }
    
    /**
     * Agrupa registros por mes
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por mes
     */
    static agruparPorMes(registros) {
        const grupos = {};
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        registros.forEach(registro => {
            const fecha = new Date(registro.fecha);
            const anio = fecha.getFullYear();
            const mes = fecha.getMonth();
            const clave = `${anio}-${mes}`;
            
            if (!grupos[clave]) {
                grupos[clave] = {
                    etiqueta: `${meses[mes]} ${anio}`,
                    anio: anio,
                    mes: mes,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0
                };
            }
            
            grupos[clave].registros.push(registro);
            grupos[clave].totalMetros += parseFloat(registro.metros || 0);
            grupos[clave].totalPedidos++;
            grupos[clave].totalBandas += parseInt(registro.bandas || 0);
            grupos[clave].totalBarras += parseInt(registro.barras || 0);
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => {
            if (a.anio !== b.anio) return a.anio - b.anio;
            return a.mes - b.mes;
        });
    }
    
    /**
     * Agrupa registros por año
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por año
     */
    static agruparPorAnio(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const fecha = new Date(registro.fecha);
            const anio = fecha.getFullYear();
            const clave = anio.toString();
            
            if (!grupos[clave]) {
                grupos[clave] = {
                    etiqueta: clave,
                    anio: anio,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0
                };
            }
            
            grupos[clave].registros.push(registro);
            grupos[clave].totalMetros += parseFloat(registro.metros || 0);
            grupos[clave].totalPedidos++;
            grupos[clave].totalBandas += parseInt(registro.bandas || 0);
            grupos[clave].totalBarras += parseInt(registro.barras || 0);
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.anio - b.anio);
    }
    
    /**
     * Agrupa registros por operario
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por operario
     */
    static agruparPorOperario(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const operario = registro.operario || 'Sin especificar';
            
            if (!grupos[operario]) {
                grupos[operario] = {
                    etiqueta: operario,
                    operario: operario,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0,
                    maquinas: {}
                };
            }
            
            grupos[operario].registros.push(registro);
            grupos[operario].totalMetros += parseFloat(registro.metros || 0);
            grupos[operario].totalPedidos++;
            grupos[operario].totalBandas += parseInt(registro.bandas || 0);
            grupos[operario].totalBarras += parseInt(registro.barras || 0);
            
            // Contar por máquina
            const maquina = registro.maquina || 'Sin especificar';
            if (!grupos[operario].maquinas[maquina]) {
                grupos[operario].maquinas[maquina] = 0;
            }
            grupos[operario].maquinas[maquina]++;
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.operario.localeCompare(b.operario));
    }
    
    /**
     * Agrupa registros por turno
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por turno
     */
    static agruparPorTurno(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const turno = registro.turno || 'Sin especificar';
            
            if (!grupos[turno]) {
                grupos[turno] = {
                    etiqueta: turno,
                    turno: turno,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0,
                    operarios: {}
                };
            }
            
            grupos[turno].registros.push(registro);
            grupos[turno].totalMetros += parseFloat(registro.metros || 0);
            grupos[turno].totalPedidos++;
            grupos[turno].totalBandas += parseInt(registro.bandas || 0);
            grupos[turno].totalBarras += parseInt(registro.barras || 0);
            
            // Contar por operario
            const operario = registro.operario || 'Sin especificar';
            if (!grupos[turno].operarios[operario]) {
                grupos[turno].operarios[operario] = 0;
            }
            grupos[turno].operarios[operario]++;
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.turno.localeCompare(b.turno));
    }
    
    /**
     * Agrupa registros por máquina
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por máquina
     */
    static agruparPorMaquina(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const maquina = registro.maquina || 'Sin especificar';
            
            if (!grupos[maquina]) {
                grupos[maquina] = {
                    etiqueta: maquina,
                    maquina: maquina,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0,
                    operarios: {}
                };
            }
            
            grupos[maquina].registros.push(registro);
            grupos[maquina].totalMetros += parseFloat(registro.metros || 0);
            grupos[maquina].totalPedidos++;
            grupos[maquina].totalBandas += parseInt(registro.bandas || 0);
            grupos[maquina].totalBarras += parseInt(registro.barras || 0);
            
            // Contar por operario
            const operario = registro.operario || 'Sin especificar';
            if (!grupos[maquina].operarios[operario]) {
                grupos[maquina].operarios[operario] = 0;
            }
            grupos[maquina].operarios[operario]++;
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.maquina.localeCompare(b.maquina));
    }
    
    /**
     * Agrupa registros por tipo
     * @param {Array} registros - Lista de registros
     * @returns {Array} Datos agrupados por tipo
     */
    static agruparPorTipo(registros) {
        const grupos = {};
        
        registros.forEach(registro => {
            const tipo = registro.tipo || 'Sin especificar';
            
            if (!grupos[tipo]) {
                grupos[tipo] = {
                    etiqueta: tipo,
                    tipo: tipo,
                    registros: [],
                    totalMetros: 0,
                    totalPedidos: 0,
                    totalBandas: 0,
                    totalBarras: 0
                };
            }
            
            grupos[tipo].registros.push(registro);
            grupos[tipo].totalMetros += parseFloat(registro.metros || 0);
            grupos[tipo].totalPedidos++;
            grupos[tipo].totalBandas += parseInt(registro.bandas || 0);
            grupos[tipo].totalBarras += parseInt(registro.barras || 0);
        });
        
        // Convertir a array y ordenar
        return Object.values(grupos).sort((a, b) => a.tipo.localeCompare(b.tipo));
    }
    
    /**
     * Genera un informe de KPI de asesores y máquinas
     * @param {Array} registros - Lista de registros
     * @returns {Object} Datos del informe
     */
    static generarInformeAsesoresMaquinas(registros) {
        // Obtener operarios y máquinas únicas
        const operarios = [...new Set(registros.map(r => r.operario).filter(Boolean))];
        const maquinas = [...new Set(registros.map(r => r.maquina).filter(Boolean))];
        
        operarios.sort();
        maquinas.sort();
        
        // Crear matriz de datos
        const matrizDatos = {};
        const totalesPorMaquina = {};
        
        // Inicializar matriz
        operarios.forEach(operario => {
            matrizDatos[operario] = {};
            maquinas.forEach(maquina => {
                matrizDatos[operario][maquina] = 0;
                totalesPorMaquina[maquina] = 0;
            });
        });
        
        // Contar pedidos por operario y máquina
        registros.forEach(registro => {
            const operario = registro.operario;
            const maquina = registro.maquina;
            
            if (operario && maquina && matrizDatos[operario] && matrizDatos[operario][maquina] !== undefined) {
                matrizDatos[operario][maquina]++;
                totalesPorMaquina[maquina]++;
            }
        });
        
        // Calcular totales por operario
        const totalesPorOperario = {};
        operarios.forEach(operario => {
            totalesPorOperario[operario] = maquinas.reduce((sum, maquina) => sum + matrizDatos[operario][maquina], 0);
        });
        
        // Calcular total general
        const totalGeneral = Object.values(totalesPorOperario).reduce((sum, total) => sum + total, 0);
        
        return {
            operarios,
            maquinas,
            matrizDatos,
            totalesPorOperario,
            totalesPorMaquina,
            totalGeneral
        };
    }
    
    /**
     * Exporta un informe de KPI a Excel
     * @param {Object} informe - Datos del informe
     * @param {string} nombreArchivo - Nombre del archivo de exportación
     */
    static exportarInformeKPI(informe, nombreArchivo = 'informe_kpi.xlsx') {

            // Verificar que los datos existen
    if (!informe || !informe.operarios || !informe.maquinas) {
        console.error('Datos de informe incompletos');
        return false;
    }
        // Crear un array de datos para exportación
        const datos = [];
        
        // Crear encabezados
        const encabezados = ['Operario', ...informe.maquinas, 'TOTAL'];
        datos.push(encabezados);
        
        // Agregar filas de datos
        informe.operarios.forEach(operario => {
            const fila = [operario];
            
            informe.maquinas.forEach(maquina => {
                fila.push(informe.matrizDatos[operario][maquina]);
            });
            
            fila.push(informe.totalesPorOperario[operario]);
            datos.push(fila);
        });
        
        // Agregar fila de totales
        const filaTotales = ['TOTALES'];
        informe.maquinas.forEach(maquina => {
            filaTotales.push(informe.totalesPorMaquina[maquina]);
        });
        filaTotales.push(informe.totalGeneral);
        datos.push(filaTotales);
        
        // Crear workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(datos);
        
        // Añadir estilos (formato de celda, negrita para encabezados y totales)
        ws['!cols'] = [{ wch: 20 }]; // Ancho de la primera columna
        for (let i = 1; i <= informe.maquinas.length + 1; i++) {
            ws['!cols'].push({ wch: 12 }); // Ancho de las demás columnas
        }
        
        // Guardar workbook
        XLSX.utils.book_append_sheet(wb, ws, "KPI Asesores-Máquinas");
        XLSX.writeFile(wb, nombreArchivo);
        
        return true;
    }
    
    /**
     * Carga registros por período
     * @param {string} periodo - Período (hoy, semana, mes, anio)
     * @returns {Array} Registros del período
     */
    static cargarRegistrosPorPeriodo(periodo) {
        const registros = Storage.getRegistros();
        const hoy = new Date();
        
        switch (periodo) {
            case 'hoy':
                return registros.filter(r => {
                    const fecha = new Date(r.fecha);
                    return fecha.toDateString() === hoy.toDateString();
                });
                
            case 'semana':
                const inicioSemana = Utils.obtenerInicioSemana(hoy);
                return registros.filter(r => {
                    const fecha = new Date(r.fecha);
                    return fecha >= inicioSemana;
                });
                
            case 'mes':
                return registros.filter(r => {
                    const fecha = new Date(r.fecha);
                    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
                });
                
            case 'anio':
                return registros.filter(r => {
                    const fecha = new Date(r.fecha);
                    return fecha.getFullYear() === hoy.getFullYear();
                });
                
            default:
                return registros;
        }
    }
}