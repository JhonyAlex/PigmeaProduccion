/**
 * Funcionalidad dedicada para reiniciar el sistema
 * Este script se encarga específicamente de manejar el reinicio de todo el sistema
 */

// Función global para reiniciar todo el sistema
window.reiniciarSistema = function() {
    console.log('Función reiniciarSistema ejecutada');
    
    try {
        // Mostrar modal de confirmación
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmTitle').textContent = 'Reiniciar Sistema';
        document.getElementById('confirmBody').innerHTML = `
            <p class="text-danger"><strong>¡ADVERTENCIA!</strong></p>
            <p>Esta acción eliminará <strong>TODOS</strong> los datos del sistema, incluyendo:</p>
            <ul>
                <li>Operarios</li>
                <li>Máquinas</li>
                <li>Registros de producción</li>
                <li>Configuraciones</li>
                <li>Todos los datos guardados</li>
            </ul>
            <p>Esta acción no se puede deshacer. ¿Está seguro de continuar?</p>
        `;
        
        // Remover listeners previos del botón confirmar
        const btnConfirmar = document.getElementById('btnConfirmar');
        const nuevoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
        
        // Añadir nuevo listener para ejecutar el reinicio
        nuevoBtn.addEventListener('click', function() {
            console.log('Acción de reinicio del sistema confirmada');
            
            try {
                // Borrar todo el localStorage
                localStorage.clear();
                console.log('localStorage completamente borrado');
                
                // Cerrar el modal
                confirmModal.hide();
                
                // Recargar la página para reflejar los cambios
                setTimeout(() => {
                    alert('Sistema reiniciado correctamente. La página se recargará.');
                    window.location.reload();
                }, 500);
            } catch (error) {
                console.error('Error al reiniciar el sistema:', error);
                alert('Error al reiniciar el sistema: ' + error.message);
            }
        });
        
        confirmModal.show();
    } catch (error) {
        console.error('Error al mostrar confirmación de reinicio:', error);
        
        // Plan B si hay error con el modal: confirmar directamente
        if (confirm('¿Está seguro de que desea reiniciar el sistema y borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            localStorage.clear();
            alert('Sistema reiniciado correctamente. La página se recargará.');
            window.location.reload();
        }
    }
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema-reset.js cargado, añadiendo event listener a btnReiniciarSistema');
    
    // Asignar event listener al botón de reinicio
    const btnReiniciarSistema = document.getElementById('btnReiniciarSistema');
    if (btnReiniciarSistema) {
        // Eliminar el atributo onclick para evitar duplicación
        btnReiniciarSistema.removeAttribute('onclick');
        
        // Agregar event listener de JavaScript para mayor control
        btnReiniciarSistema.addEventListener('click', function(e) {
            e.preventDefault();
            window.reiniciarSistema();
        });
        console.log('Event listener asignado correctamente a btnReiniciarSistema');
    } else {
        console.warn('Botón btnReiniciarSistema no encontrado en el DOM');
        
        // Intentar asignar el evento después de un breve retraso
        setTimeout(() => {
            const btnReiniciarSistema = document.getElementById('btnReiniciarSistema');
            if (btnReiniciarSistema) {
                btnReiniciarSistema.removeAttribute('onclick');
                btnReiniciarSistema.addEventListener('click', window.reiniciarSistema);
                console.log('Event listener asignado con retraso a btnReiniciarSistema');
            }
        }, 1000);
    }
});
