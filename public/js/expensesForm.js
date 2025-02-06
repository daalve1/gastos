/** 
 * Maneja la lógica del formulario de gastos
 */

import { showToast } from './toast_module.js';
import { validateForm } from './validation_module.js';

// tag::functions

async function processResultEnviarGasto(response) {
    // Recuperar respuesta
    const data = await response.json();

    // Comprobar que se ha resuelto de forma correcta
    if (response.ok) {
        // Mostrar mensaje a usuario
        showToast('Gasto registrado con éxito.', 'success');

        // Resetear el formulario
        document.getElementById('expenseForm').reset(); 
    } else {
        // Mostrar mensaje de error
        showToast('Error: ' + data.message, 'danger');
    }
}

async function enviarGasto(form) {
    // Obtiene los datos del formulario
    const data = Object.fromEntries(new FormData(form));

    const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    processResultEnviarGasto(response);
}

export function handleSubmitCrearGasto(form) {
    console.log('Enviando formulario...');

    // Validaciones campos
    if(validateForm(form)) {
        // Enviar datos al servidor
        enviarGasto(form);
    }
}

/**
 * Función para manejar el evento de cambio en el campo de comentario
 * 
 * @param {*} e Evento de cambio en el campo de comentario
 */
function handleChangeComment(e) {
    // Obtiene el número de caracteres escritos en el campo de comentario
    const comment = e.currentTarget;
    
    // Obtener propiedad maxlength del campo de comentario
    const maxLength = parseInt(comment.getAttribute('maxlength'));

    // Obtener longiud actual del comentario
    const currentLength = comment.value.length;

    // Muestra el número de caracteres escritos en el campo de comentario
    document.getElementById('commentLength').textContent = `${currentLength}/${maxLength}`;
}

export default function initializeEvents() {
    document.getElementById('comment').addEventListener('input', handleChangeComment);
}

// end::functions

// tag::Eventos

// end::Eventos