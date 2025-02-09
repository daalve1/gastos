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

// Función async para cargar los tipos de gasto y poblar el select
async function cargarTiposDeGasto() {

    const response = await fetch('/api/expenses-types');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Lanza un error si la respuesta HTTP no es exitosa
    }

    const data = await response.json(); // Convierte la respuesta a JSON y espera el resultado

    const selectExpensesTypes = document.getElementById('expenseType'); // Obtiene el elemento select por su ID

    if (!selectExpensesTypes) {
        console.error('Elemento select con id "expenseType" no encontrado en el HTML.');
        return; // Sale de la función si no encuentra el select
    }

     // Limpia el select antes de añadir nuevas opciones (opcional)
    selectExpensesTypes.innerHTML = '';

    // Crea una opción por defecto (opcional, placeholder)
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un tipo de gasto';
    selectExpensesTypes.appendChild(defaultOption);

    data.forEach(tipoGasto => {
        const option = document.createElement('option');
        option.value = tipoGasto.id;
        option.textContent = tipoGasto.description;
        selectExpensesTypes.appendChild(option);
    });
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
    // Cargar tipos de gasto
    cargarTiposDeGasto();

    // Manejar evento de cambio en el campo de comentario
    document.getElementById('comment').addEventListener('input', handleChangeComment);
}

// end::functions

// tag::Eventos

// end::Eventos