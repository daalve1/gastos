import { showToast } from './toast_module.js';

/**
 * Valida los campos input, select y textarea de un formulario.
 * 
 * @param {*} form Formulario a validar.
 * @returns {boolean} true si el formulario es válido, false en caso contrario.
 */
export function validateForm(form) {
    // Implementar validación de formulario segun el tipo de campo a partir de un formdata
    let isValid = true;

    // Recupera todos los campos input, select y textarea del formulario
    const elements = form.elements;

    // Itera sobre los elementos del formulario
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Comprueba si el elemento es un campo de entrada
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
            // Valida el campo
            const error = validateField(element);

            // Si hay un error, muestra un mensaje y marca el formulario como no válido
            if (error) {
                showToast(error, 'danger');
                isValid = false;
            }
        }
    }

    return isValid;
}

/**
 * Validación del campo recibido por parámetro.
 * 
 * @param {*} element Campo a validar.
 * @returns {string} Mensaje de error si el campo no es válido, null en caso contrario.
 */
function validateField(element) {
    const resultRequired = validateRequired(element);

    // Comprueba si el campo es obligatorio y está vacío
    if(resultRequired) return;

    // Valida el campo según el tipo de campo
    switch (element.type) {
        case 'text':
        case 'textarea':
            return validateText(element);
        case 'number':
            return validateNumber(element);
        case 'date':
            return validateDate(element);
        default:
            return null;
    }
}

function validateRequired(element) {
    // Comprueba si el campo está vacío
    if (element.required && element.value.trim() === '') {
        return `El campo ${element} es obligatorio.`;
    }
}

/**
 * Valida un campo de texto.
 * 
 * @param {string} element Campo de texto a validar.
 */
function validateText(element) {
    return null;
}

/**
 * Valida un campo numérico.
 * 
 * @param {string} element Campo numérico a validar.
 */
function validateNumber(element) {
    // Comprueba si el campo es un número
    if (isNaN(element.value)) {
        return 'Este campo debe ser un número.';
    }

    return null;
}

/**
 * Valida un campo de fecha.
 * 
 * @param {string} element Campo de fecha a validar.
 */
function validateDate(element) {
    // Comprueba si el campo es una fecha válida
    if (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(element.value)) {
        return 'Este campo debe ser una fecha válida.';
    }

    return null;
}