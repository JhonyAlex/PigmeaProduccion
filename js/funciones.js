// js/funciones.js (Este archivo ahora contiene las funciones para gestionar operarios)

document.addEventListener('DOMContentLoaded', function () {
    // Este evento se ejecuta una vez que el DOM (Document Object Model) está completamente cargado.
    // Asegura que el código JavaScript se ejecute después de que el HTML esté listo.

    // --- Gestión de Operarios ---
    // Seleccionamos los elementos del DOM que vamos a usar.
    const operarioForm = document.getElementById('operarioForm'); // El formulario para agregar operarios.
    const nombreOperarioInput = document.getElementById('nombreOperario'); // El input donde se escribe el nombre del operario.
    const tablaOperariosBody = document.getElementById('tablaOperarios').querySelector('tbody'); // El cuerpo de la tabla donde se mostrarán los operarios.

    // Función para obtener los operarios desde LocalStorage.
    function getOperarios() {
        // Intenta obtener la lista de operarios desde localStorage.
        const operariosJSON = localStorage.getItem('operarios');
        // Si hay datos en localStorage, los convierte de JSON a un array de JavaScript.
        // Si no hay datos, devuelve un array vacío ([]).
        return operariosJSON ? JSON.parse(operariosJSON) : [];
    }

    // Función para guardar los operarios en LocalStorage.
    function saveOperarios(operarios) {
        // Convierte el array de operarios a una cadena JSON.
        // Luego, guarda la cadena JSON en localStorage con la clave 'operarios'.
        localStorage.setItem('operarios', JSON.stringify(operarios));
    }

    // Función para renderizar (dibujar) la tabla de operarios.
    function renderOperariosTable() {
        tablaOperariosBody.innerHTML = ''; // Limpia el contenido actual de la tabla (borra todas las filas).

        const operarios = getOperarios(); // Obtiene la lista actual de operarios.
        operarios.forEach((operario, index) => { // Itera sobre cada operario en la lista.
            const row = document.createElement('tr'); // Crea una nueva fila (<tr>) de tabla.
            row.innerHTML = `
                <td>${operario}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-eliminar-operario" data-index="${index}">Eliminar</button>
                </td>
            `;
            // Añade la fila a la tabla, al final del tbody.
            tablaOperariosBody.appendChild(row);
        });
        
         // Eventos de escucha para los botones "Eliminar" (después de renderizar)
         const deleteButtons = tablaOperariosBody.querySelectorAll('.btn-eliminar-operario');
         deleteButtons.forEach(button => {
             button.addEventListener('click', (e) => {
                 const index = e.target.dataset.index;
                 eliminarOperario(index);
             });
         });
    }
    
     //Función para eliminar operarios
     function eliminarOperario(index) {
        let operarios = getOperarios(); // Obtiene la lista actual de operarios.
        operarios.splice(index, 1); // Elimina el operario en la posición 'index'.
        saveOperarios(operarios); // Guarda la lista actualizada en localStorage.
        renderOperariosTable(); // Vuelve a renderizar la tabla para mostrar los cambios.
    }

    // Agregar un nuevo operario.
    operarioForm.addEventListener('submit', function (e) {
        // Evita que el formulario se envíe de la forma tradicional (recargando la página).
        e.preventDefault();
        const nombreOperario = nombreOperarioInput.value.trim(); // Obtiene el nombre del operario y elimina los espacios al principio y al final.

        if (nombreOperario) { // Verifica si el nombre del operario no está vacío.
            const operarios = getOperarios(); // Obtiene la lista actual de operarios.
            operarios.push(nombreOperario); // Agrega el nuevo nombre al final de la lista.
            saveOperarios(operarios); // Guarda la lista actualizada en localStorage.
            nombreOperarioInput.value = ''; // Limpia el campo de entrada.
            renderOperariosTable(); // Vuelve a renderizar la tabla.

            // Actualiza las opciones del select de operarios en la sección "registro".
            updateOperarioSelect();
            
            // Actualiza las opciones del select de operarios en la sección "reportes".
            updateOperarioReportesSelect();
             // Actualiza las opciones del select de operarios en la sección "baseDatos".
            updateOperarioBaseDatosSelect();
        }
    });
    
    //Función para actualizar el select de la sección registro
    function updateOperarioSelect(){
         const selectOperario = document.getElementById('operario'); //Obtiene el select de operario de la sección "registro".
         selectOperario.innerHTML = '<option value="">Seleccionar...</option>';//Limpia el select.
         const operarios = getOperarios(); //Obtiene los operarios almacenados.
         operarios.forEach(operario=>{//Por cada operario.
              const option = document.createElement('option'); //Se crea una option.
               option.value = operario; //Se le agrega el valor.
               option.text = operario; //Se le agrega el texto a mostrar.
               selectOperario.appendChild(option);//Se añade el option al select.
         });
    }
    
    //Función para actualizar el select de la sección reportes
     function updateOperarioReportesSelect(){
         const selectOperario = document.getElementById('reporteOperario'); //Obtiene el select de operario de la sección "reportes".
         selectOperario.innerHTML = '<option value="">Todos</option>';//Limpia el select.
         const operarios = getOperarios();//Obtiene los operarios almacenados.
         operarios.forEach(operario=>{//Por cada operario.
              const option = document.createElement('option');//Se crea una option.
               option.value = operario;//Se le agrega el valor.
               option.text = operario;//Se le agrega el texto a mostrar.
               selectOperario.appendChild(option);//Se añade el option al select.
         });
    }
    //Función para actualizar el select de la sección baseDatos
     function updateOperarioBaseDatosSelect(){
         const selectOperario = document.getElementById('filtroOperario');//Obtiene el select de operario de la sección "baseDatos".
         selectOperario.innerHTML = '<option value="">Todos los Operarios</option>';//Limpia el select.
         const operarios = getOperarios();//Obtiene los operarios almacenados.
         operarios.forEach(operario=>{//Por cada operario.
              const option = document.createElement('option');//Se crea una option.
               option.value = operario;//Se le agrega el valor.
               option.text = operario;//Se le agrega el texto a mostrar.
               selectOperario.appendChild(option);//Se añade el option al select.
         });
    }
    // Renderizado inicial de la tabla.
    renderOperariosTable();
    //Actualización inicial de los selects.
    updateOperarioSelect();
    updateOperarioReportesSelect();
    updateOperarioBaseDatosSelect();
    // ... (resto de tu código navigation.js) ...
});
