// js/navigation.js (or a new js file if you prefer)

document.addEventListener('DOMContentLoaded', function () {
    // ... (rest of your navigation.js code) ...

    // --- Operarios Management ---
    const operarioForm = document.getElementById('operarioForm');
    const nombreOperarioInput = document.getElementById('nombreOperario');
    const tablaOperariosBody = document.getElementById('tablaOperarios').querySelector('tbody');

    // Function to get Operarios from LocalStorage
    function getOperarios() {
        const operariosJSON = localStorage.getItem('operarios');
        return operariosJSON ? JSON.parse(operariosJSON) : [];
    }

    // Function to save Operarios to LocalStorage
    function saveOperarios(operarios) {
        localStorage.setItem('operarios', JSON.stringify(operarios));
    }

    // Function to render Operarios table
    function renderOperariosTable() {
        tablaOperariosBody.innerHTML = ''; // Clear the table

        const operarios = getOperarios();
        operarios.forEach((operario, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${operario}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-eliminar-operario" data-index="${index}">Eliminar</button>
                </td>
            `;
            tablaOperariosBody.appendChild(row);
        });
        
         // Event Listeners for "Eliminar" buttons (after rendering)
         const deleteButtons = tablaOperariosBody.querySelectorAll('.btn-eliminar-operario');
         deleteButtons.forEach(button => {
             button.addEventListener('click', (e) => {
                 const index = e.target.dataset.index;
                 eliminarOperario(index);
             });
         });
    }
    
     function eliminarOperario(index) {
        let operarios = getOperarios();
        operarios.splice(index, 1);
        saveOperarios(operarios);
        renderOperariosTable();
    }

    // Add new Operario
    operarioForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombreOperario = nombreOperarioInput.value.trim();

        if (nombreOperario) {
            const operarios = getOperarios();
            operarios.push(nombreOperario);
            saveOperarios(operarios);
            nombreOperarioInput.value = '';
            renderOperariosTable();

            // Update select options on the "registro" section
            updateOperarioSelect();
            
            // Update select options on the "reportes" section
            updateOperarioReportesSelect();
             // Update select options on the "baseDatos" section
            updateOperarioBaseDatosSelect();
        }
    });
    
    function updateOperarioSelect(){
         const selectOperario = document.getElementById('operario');
         selectOperario.innerHTML = '<option value="">Seleccionar...</option>';
         const operarios = getOperarios();
         operarios.forEach(operario=>{
              const option = document.createElement('option');
               option.value = operario;
               option.text = operario;
               selectOperario.appendChild(option);
         });
    }
    
     function updateOperarioReportesSelect(){
         const selectOperario = document.getElementById('reporteOperario');
         selectOperario.innerHTML = '<option value="">Todos</option>';
         const operarios = getOperarios();
         operarios.forEach(operario=>{
              const option = document.createElement('option');
               option.value = operario;
               option.text = operario;
               selectOperario.appendChild(option);
         });
    }
     function updateOperarioBaseDatosSelect(){
         const selectOperario = document.getElementById('filtroOperario');
         selectOperario.innerHTML = '<option value="">Todos los Operarios</option>';
         const operarios = getOperarios();
         operarios.forEach(operario=>{
              const option = document.createElement('option');
               option.value = operario;
               option.text = operario;
               selectOperario.appendChild(option);
         });
    }
    // Initial table render
    renderOperariosTable();
    updateOperarioSelect();
    updateOperarioReportesSelect();
    updateOperarioBaseDatosSelect();
    // ... (rest of your navigation.js code) ...
});
