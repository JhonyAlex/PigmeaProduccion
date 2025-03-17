// Función para manejar la navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todas las secciones
    const sections = document.querySelectorAll('section[id$="Section"]');
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[data-section]');
    
    // Función para mostrar una sección específica
    function showSection(sectionId) {
        // Ocultar todas las secciones
        sections.forEach(section => {
            section.classList.add('d-none');
        });
        
        // Mostrar la sección seleccionada
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('d-none');
        }
        
        // Actualizar clases active en la navegación
        navLinks.forEach(link => {
            link.classList.remove('active-section');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active-section');
            }
        });
        
        // Cerrar el menú hamburguesa en móviles si está abierto
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
        
        // Actualizar URL con hash sin recargar la página
        history.pushState(null, null, '#' + sectionId.replace('Section', ''));
    }
    
    // Manejar clics en los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Establecer sección inicial basada en la URL hash
    function setInitialSection() {
        let hash = window.location.hash.substr(1);
        if (hash) {
            // Añadir "Section" al final si no lo tiene
            if (!hash.endsWith('Section')) {
                hash += 'Section';
            }
            
            // Verificar si existe la sección
            const section = document.getElementById(hash);
            if (section) {
                showSection(hash);
                return;
            }
        }
        
        // Por defecto, mostrar el Dashboard
        showSection('dashboardSection');
    }
    
    // Inicializar la sección al cargar la página
    setInitialSection();
    
    // Escuchar cambios en la URL hash
    window.addEventListener('hashchange', setInitialSection);
});