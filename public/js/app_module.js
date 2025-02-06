/**
 * Módulo para gestionar la aplicación.
 */

import { handleSubmitCrearGasto } from './expensesForm.js';

// Asignar la función manualmente a `window` para que esté disponible en el ámbito global
window.handleSubmitCrearGasto = handleSubmitCrearGasto;