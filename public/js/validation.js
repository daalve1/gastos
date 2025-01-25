// validation.js

/**
 * Valida la descripción.
 * @param {string} description - Descripción del gasto.
 * @returns {string|null} Mensaje de error o null si es válido.
 */
export function validateDescription(description) {
    if (!description.trim()) {
        return 'La descripción no puede estar vacía.';
    }
    return null;
}

/**
 * Valida la cantidad.
 * @param {number} amount - Cantidad ingresada.
 * @returns {string|null} Mensaje de error o null si es válido.
 */
export function validateAmount(amount) {
    if (isNaN(amount) || amount <= 0) {
        return 'La cantidad debe ser un número positivo.';
    }
    return null;
}

/**
 * Valida la fecha.
 * @param {string} date - Fecha ingresada.
 * @returns {string|null} Mensaje de error o null si es válida.
 */
export function validateDate(date) {
    if (!date) {
        return 'La fecha es obligatoria.';
    }

    const today = new Date();
    const selectedDate = new Date(date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    if (selectedDate > today) {
        return 'La fecha no puede ser mayor al día actual.';
    }
    if (selectedDate < oneYearAgo) {
        return 'La fecha no puede ser menor a hace un año.';
    }
    return null;
}
