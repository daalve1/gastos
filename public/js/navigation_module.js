/**
 * Módulo para gestionar la navegación y el menú flotante.
 */

import { initializeEventsForm } from './form_module.js';

// tag::functions

/** 
 * Manejo de navegación sin recarga
 * 
 * @param {string} path Ruta a la que navegar.
 */
export function navigateTo(path) {
    history.pushState({}, '', path);
    handleNavigation();
}

/** 
* Carga el contenido basado en la URL actual
* 
* @returns {Promise<void>}
*/
async function handleNavigation() {
    const routes = {
        '/': '/expensesForm.html',
        '/expenses': '/expensesList.html',
        '/add-expense': '/expensesForm.html'
    };

    const path = window.location.pathname;
    const htmlPath = routes[path] || '/index.html';

    const response = await fetch(htmlPath);
    const content = await response.text();
    document.getElementById('content').innerHTML = content;

    // Inicializar eventos del formulario
    initializeEventsForm();

    // Cargar JS específico si es necesario
    if (path === '/expenses') {
        import('./expensesList.js').then(module => module.default());

    } else if (path === '/add-expense') {
        import('./expensesForm.js').then(module => module.default());
    }
}

/**
 * Función que permite mostrar u ocultar el menú flotante
 * 
 * @returns {void}
 */
function toggleMenu() {
    const menu = document.getElementById('fabMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// end::functions

// tag::events

/** 
 * Evento para manejar la navegación con botones del navegador (adelante/atrás)
 * 
 * @returns {Promise<void>}
 */
window.addEventListener('popstate', handleNavigation);

/**
 * Evento para manejar la carga de la vista inicial cuando se carga la página
 * 
 * @returns {Promise<void>}
 */
document.addEventListener('DOMContentLoaded', handleNavigation);

/** 
 * Evento para manejar click en el botón flotante
 * 
 * @returns {void}
 */
document.getElementById('fab').addEventListener('click', () => {
    toggleMenu(); // Mostrar/ocultar el menú
});

/** 
 * Evento para manejar el click en el botón de agregar gasto
 * 
 * @returns {void}
 */
document.getElementById('addExpenseButton').addEventListener('click', () => {
    navigateTo('/add-expense');
    toggleMenu();
});

/**
 * Evento para manejar el click en el botón de ver gastos
 */
document.getElementById('viewExpensesButton').addEventListener('click', () => {
    navigateTo('/expenses');
    toggleMenu();
});

// end::events