// js/navigation.js
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // FUNCIONES PARA NAVEGAR ENTRE SECCIONES
    // Function to hide all sections
    function hideAllSections() {
        sections.forEach(section => {
            section.classList.add('d-none');
        });
    }

    // Function to show a specific section
    function showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('d-none');
        }
    }

    // Function to update the active state of the navbar links
    function updateActiveNavLink(target) {
        navLinks.forEach(link => {
            link.classList.remove('active-section');
        });
        target.classList.add('active-section');
    }

    // Event listener for navbar link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default jump-to-section behavior

            const sectionId = this.dataset.section; // Get the section ID from data-section
            if (sectionId) {
                hideAllSections(); // Hide all sections
                showSection(sectionId); // Show the selected section
                updateActiveNavLink(this); // Update the active link
            }
        });
    });

    // Show the dashboard section by default
    hideAllSections();
    showSection('dashboardSection');
    // Set the dashboard link as active by default
    const dashboardLink = document.querySelector('.nav-link[data-section="dashboardSection"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active-section');
    }
});
