/**
 * Módulo que gestiona las funciones de los formularios.
 */

// tag::functions

/**
 * Evento que se dispara al enviar el formulario de gastos.
 * 
 * @param {Event} e Evento de envío de formulario.
 */
export function initializeEventsForm() {    
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const form = e.currentTarget;
            
            // Obtener propiedad data-submit del form
            const callbackName = form.dataset.callback;

            console.log(callbackName);
            console.log(typeof window[callbackName]);

            // Comprobar si la función existe
            if (typeof window[callbackName] === 'function') {
                // Ejecuta la función si existe
                window[callbackName](form);
            } else {
                console.error(`La función "${callbackName}" no está definida.`);
            }
        });
    });
}

// end::functions

// tag::events
// end::events