import { loadView } from "./navigation_module.js";

// Evento para esperar a cargar el DOM antes de ejecutar el código
window.addEventListener('load', () => {
    // Cargar la vista inicial (formulario de gastos)
    loadView('expensesForm.html', 'js/expensesForm.js');
});