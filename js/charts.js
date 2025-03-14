/**
 * Gestión de gráficos y visualización de datos
 */
const Charts = {
    /**
     * Crea un gráfico de pedidos por semana
     * @param {string} canvasId - ID del elemento canvas
     * @param {Array} registros - Lista de registros
     * @returns {Chart} Objeto Chart.js
     */
    crearGraficoPedidosSemana(canvasId, registros) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        // Destruir gráfico existente si hay uno
        this.destruirGraficoExistente(canvas);
        
        // Agrupar datos por semana
        const datosPorSemana = this.agruparPedidosPorSemana(registros);
        
        // Limitar a las últimas 10 semanas
        const semanas = Object.keys(datosPorSemana).slice(-10);
        const cantidadPedidos = semanas.map(semana => datosPorSemana[semana].pedidos);
        const cantidadMetros = semanas.map(semana => datosPorSemana[semana].metros);
        
        // Crear gráfico
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: semanas,
                datasets: [
                    {
                        label: 'Cantidad de Pedidos',
                        data: cantidadPedidos,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Metros',
                        data: cantidadMetros,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y') {
                                    label += context.parsed.y;
                                } else {
                                    label += Utils.formatoNumero(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Pedidos'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'Metros'
                        }
                    }
                }
            }
        });
        
        return chart;
    },
    
    /**
     * Crea un gráfico de metros por operario
     * @param {string} canvasId - ID del elemento canvas
     * @param {Array} registros - Lista de registros
     * @returns {Chart} Objeto Chart.js
     */
    crearGraficoMetrosPorOperario(canvasId, registros) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        // Destruir gráfico existente si hay uno
        this.destruirGraficoExistente(canvas);
        
        // Agrupar datos por operario
        const metrosPorOperario = {};
        const pedidosPorOperario = {};
        
        registros.forEach(registro => {
            if (!registro.operario) return;
            
            if (!metrosPorOperario[registro.operario]) {
                metrosPorOperario[registro.operario] = 0;
                pedidosPorOperario[registro.operario] = 0;
            }
            
            metrosPorOperario[registro.operario] += parseFloat(registro.metros || 0);
            pedidosPorOperario[registro.operario]++;
        });
        
        // Convertir a arrays para gráfico
        const operarios = Object.keys(metrosPorOperario);
        const metrosArray = operarios.map(operario => metrosPorOperario[operario]);
        const pedidosArray = operarios.map(operario => pedidosPorOperario[operario]);
        
        // Colores para el gráfico
        const colores = Utils.generarColores(operarios.length);
        
        // Crear gráfico
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: operarios,
                datasets: [
                    {
                        label: 'Metros',
                        data: metrosArray,
                        backgroundColor: colores,
                        borderColor: colores.map(color => color.replace('0.7', '1')),
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Pedidos',
                        data: pedidosArray,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y') {
                                    label += Utils.formatoNumero(context.parsed.y);
                                } else {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Metros'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'Pedidos'
                        }
                    }
                }
            }
        });
        
        return chart;
    },
    
    /**
     * Crea un gráfico de producción por operario
     * @param {string} canvasId - ID del elemento canvas
     * @param {Array} registros - Lista de registros
     * @param {string} agrupacion - Tipo de agrupación
     * @returns {Chart} Objeto Chart.js
     */
    crearGraficoProduccionPorOperario(canvasId, registros, agrupacion) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        // Destruir gráfico existente si hay uno
        this.destruirGraficoExistente(canvas);
        
        // Obtener operarios únicos
        const operarios = [...new Set(registros.map(r => r.operario).filter(Boolean))];
        
        // Agrupar datos según la agrupación seleccionada
        let datosAgrupados = [];
        
        switch (agrupacion) {
            case 'dia':
                datosAgrupados = this.agruparPorDia(registros, operarios);
                break;
            case 'semana':
                datosAgrupados = this.agruparPorSemana(registros, operarios);
                break;
            case 'mes':
                datosAgrupados = this.agruparPorMes(registros, operarios);
                break;
            case 'anio':
                datosAgrupados = this.agruparPorAnio(registros, operarios);
                break;
            case 'operario':
                datosAgrupados = this.agruparPorOperario(registros);
                break;
            case 'turno':
                datosAgrupados = this.agruparPorTurno(registros, operarios);
                break;
            case 'tipo':
                datosAgrupados = this.agruparPorTipo(registros, operarios);
                break;
            default:
                datosAgrupados = this.agruparPorSemana(registros, operarios);
        }
        
        // Crear gráfico
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: datosAgrupados,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                return label + Utils.formatoNumero(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Metros'
                        }
                    }
                }
            }
        });
        
        return chart;
    },
    
    /**
     * Crea un gráfico de producción por tipo
     * @param {string} canvasId - ID del elemento canvas
     * @param {Array} registros - Lista de registros
     * @returns {Chart} Objeto Chart.js
     */
    crearGraficoProduccionPorTipo(canvasId, registros) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        // Destruir gráfico existente si hay uno
        this.destruirGraficoExistente(canvas);
        
        // Agrupar por tipo
        const metrosPorTipo = {};
        const pedidosPorTipo = {};
        
        registros.forEach(registro => {
            const tipo = registro.tipo || 'Sin especificar';
            
            if (!metrosPorTipo[tipo]) {
                metrosPorTipo[tipo] = 0;
                pedidosPorTipo[tipo] = 0;
            }
            
            metrosPorTipo[tipo] += parseFloat(registro.metros || 0);
            pedidosPorTipo[tipo]++;
        });
        
        // Convertir a arrays para gráficos
        const tipos = Object.keys(metrosPorTipo);
        const metrosArray = tipos.map(tipo => metrosPorTipo[tipo]);
        const pedidosArray = tipos.map(tipo => pedidosPorTipo[tipo]);
        
        // Colores para el gráfico
        const colores = Utils.generarColores(tipos.length);
        
        // Crear gráfico
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: tipos,
                datasets: [{
                    label: 'Metros',
                    data: metrosArray,
                    backgroundColor: colores,
                    borderColor: colores.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${Utils.formatoNumero(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        return chart;
    },
    
    /**
     * Destruye un gráfico existente
     * @param {HTMLElement} canvas - Elemento canvas
     */
    destruirGraficoExistente(canvas) {
        const chartInstance = Chart.getChart(canvas);
        if (chartInstance) {
            chartInstance.destroy();
        }
    },
    
    /**
     * Agrupa pedidos por semana
     * @param {Array} registros - Lista de registros
     * @returns {Object} Datos agrupados por semana
     */
    agruparPedidosPorSemana(registros) {
        const datosPorSemana = {};
        
        registros.forEach(registro => {
            const fecha = new Date(registro.fecha);
            const anio = fecha.getFullYear();
            const semana = registro.semana || 1;
            const clave = `${anio}-S${semana}`;
            
            if (!datosPorSemana[clave]) {
                datosPorSemana[clave] = {
                    pedidos: 0,
                    metros: 0
                };
            }
            
            datosPorSemana[clave].pedidos++;
            datosPorSemana[clave].metros += parseFloat(registro.metros || 0);
        });
        
        return datosPorSemana;
    },
    
    /**
     * Agrupa datos por día
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorDia(registros, operarios) {
        // Obtener días únicos
        const diasUnicos = [...new Set(registros.map(r => new Date(r.fecha).toLocaleDateString()))];
        diasUnicos.sort((a, b) => new Date(a) - new Date(b));
        
        // Limitar a los últimos 14 días para que sea manejable
        const diasLimitados = diasUnicos.slice(-14);
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = diasLimitados.map(dia => {
                return registros
                    .filter(r => new Date(r.fecha).toLocaleDateString() === dia && r.operario === operario)
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: diasLimitados.map(dia => new Date(dia).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })),
            datasets: datasets
        };
    },
    
    /**
     * Agrupa datos por semana
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorSemana(registros, operarios) {
        // Obtener semanas únicas
        const semanasUnicas = [...new Set(registros.map(r => {
            const fecha = new Date(r.fecha);
            return `${fecha.getFullYear()}-S${r.semana || 1}`;
        }))];
        semanasUnicas.sort();
        
        // Limitar a las últimas 10 semanas
        const semanasLimitadas = semanasUnicas.slice(-10);
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = semanasLimitadas.map(semana => {
                const [anio, numSemana] = semana.split('-S');
                return registros
                    .filter(r => {
                        const fecha = new Date(r.fecha);
                        return fecha.getFullYear() === parseInt(anio) && 
                               (r.semana || 1) === parseInt(numSemana) && 
                               r.operario === operario;
                    })
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: semanasLimitadas,
            datasets: datasets
        };
    },
    
    /**
     * Agrupa datos por mes
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorMes(registros, operarios) {
        // Obtener meses únicos
        const mesesUnicos = [...new Set(registros.map(r => {
            const fecha = new Date(r.fecha);
            return `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
        }))];
        mesesUnicos.sort();
        
        // Crear labels más legibles
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const labelsLegibles = mesesUnicos.map(mes => {
            const [anio, numMes] = mes.split('-');
            return `${meses[parseInt(numMes) - 1]} ${anio}`;
        });
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = mesesUnicos.map(mes => {
                const [anio, numMes] = mes.split('-');
                return registros
                    .filter(r => {
                        const fecha = new Date(r.fecha);
                        return fecha.getFullYear() === parseInt(anio) && 
                               fecha.getMonth() + 1 === parseInt(numMes) && 
                               r.operario === operario;
                    })
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: labelsLegibles,
            datasets: datasets
        };
    },
    
    /**
     * Agrupa datos por año
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorAnio(registros, operarios) {
        // Obtener años únicos
        const aniosUnicos = [...new Set(registros.map(r => new Date(r.fecha).getFullYear()))];
        aniosUnicos.sort();
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = aniosUnicos.map(anio => {
                return registros
                    .filter(r => new Date(r.fecha).getFullYear() === anio && r.operario === operario)
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: aniosUnicos,
            datasets: datasets
        };
    },
    
    /**
     * Agrupa datos por operario
     * @param {Array} registros - Lista de registros
     * @returns {Object} Datos agrupados
     */
    agruparPorOperario(registros) {
        // Obtener operarios únicos
        const operarios = [...new Set(registros.map(r => r.operario).filter(Boolean))];
        operarios.sort();
        
        // Calcular metros por operario
        const metrosPorOperario = operarios.map(operario => {
            return registros
                .filter(r => r.operario === operario)
                .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
        });
        
        // Calcular pedidos por operario
        const pedidosPorOperario = operarios.map(operario => {
            return registros.filter(r => r.operario === operario).length;
        });
        
        // Generar colores
        const colores = Utils.generarColores(operarios.length);
        
        return {
            labels: operarios,
            datasets: [
                {
                    label: 'Metros',
                    data: metrosPorOperario,
                    backgroundColor: colores,
                    borderColor: colores.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }
            ]
        };
    },
    
    /**
     * Agrupa datos por turno
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorTurno(registros, operarios) {
        // Obtener turnos únicos
        const turnos = [...new Set(registros.map(r => r.turno).filter(Boolean))];
        turnos.sort();
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = turnos.map(turno => {
                return registros
                    .filter(r => r.turno === turno && r.operario === operario)
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: turnos,
            datasets: datasets
        };
    },
    
    /**
     * Agrupa datos por tipo
     * @param {Array} registros - Lista de registros
     * @param {Array} operarios - Lista de operarios
     * @returns {Object} Datos agrupados
     */
    agruparPorTipo(registros, operarios) {
        // Obtener tipos únicos
        const tipos = [...new Set(registros.map(r => r.tipo || 'Sin especificar').filter(Boolean))];
        tipos.sort();
        
        // Crear datasets
        const datasets = [];
        const colores = Utils.generarColores(operarios.length);
        
        operarios.forEach((operario, index) => {
            const data = tipos.map(tipo => {
                return registros
                    .filter(r => (r.tipo || 'Sin especificar') === tipo && r.operario === operario)
                    .reduce((sum, r) => sum + parseFloat(r.metros || 0), 0);
            });
            
            datasets.push({
                label: operario,
                data: data,
                backgroundColor: colores[index],
                borderColor: colores[index].replace('0.7', '1'),
                borderWidth: 1
            });
        });
        
        return {
            labels: tipos,
            datasets: datasets
        };
    }
};