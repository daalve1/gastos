// expensesList.js - Maneja la carga de los gastos y su visualización

import { showToast } from './toast_module.js';

// Función para mostrar el modal de confirmación
function showConfirmationModal(expenseId) {
    // Verifica que el modal está inicializado antes de intentar mostrarlo
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'), {
        backdrop: 'static', // evita cerrar el modal al hacer clic fuera
        keyboard: false // desactiva cerrar con el teclado (Esc)
    });

    confirmationModal.show();

    // Acción al hacer clic en el botón "Eliminar"
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.onclick = async function() {
        // Llama a la función de eliminar gasto
        await deleteExpense(expenseId);
        confirmationModal.hide(); // Cierra el modal después de eliminar
    };
}

async function deleteExpense(expenseId) {
    // Enviar la solicitud DELETE al servidor
    const response = await fetch(`/api/expenses/delete/${expenseId}` , { method: 'DELETE' });
    
    if(response.ok) {
        loadExpenses();
    } else {
        showToast('No se pudo eliminar el gasto', 'danger');
    }
}

export default async function loadExpenses() {
    console.log('Cargando gastos...');

    const response = await fetch('/api/expenses');

    if (response.ok) {
        console.log(response);
        const expenses = await response.json();

        const tableBody = document.querySelector('#expensesTable tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir los nuevos datos

        expenses.forEach(expense => {
            console.log(expense);
            const row = document.createElement('tr');

            // Crear el icono de eliminar programáticamente
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('bi', 'bi-trash3'); // Añadir clases de Bootstrap Icons
            deleteIcon.style.cursor = 'pointer'; // Opcional: cambiar el cursor para indicar que es clickable

            // Añadir event listener al icono para mostrar el modal
            deleteIcon.addEventListener('click', function() { // Usamos una función anónima para acceder al scope correcto
                showConfirmationModal(expense.id); // Llamada a showConfirmationModal dentro del scope del módulo
            });

            // Crear las celdas de la tabla
            const expenseTypeCell = document.createElement('td');
            expenseTypeCell.textContent = expense.expenseType;

            const commentCell = document.createElement('td');
            commentCell.textContent = expense.comment;

            const amountCell = document.createElement('td');
            amountCell.textContent = expense.amount;

            const dateCell = document.createElement('td');
            dateCell.textContent = expense.date;

            const deleteCell = document.createElement('td');
            deleteCell.appendChild(deleteIcon); // Añadir el icono a la celda de eliminar

            // Añadir celdas a la fila
            row.appendChild(expenseTypeCell);
            row.appendChild(commentCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(deleteCell);


            tableBody.appendChild(row);
        });
    } else {
        showToast('No se pudo cargar los gastos', 'danger');
    }
}