// expensesList.js - Maneja la carga de los gastos y su visualización

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
        alert('No se pudo eliminar el gasto');
    }
}

async function loadExpenses() {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();

    const tableBody = document.querySelector('#expensesTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir los nuevos datos

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.description}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td><i class="bi bi-trash3" onClick="showConfirmationModal(${expense.id})"></i></td>
        `;
        tableBody.appendChild(row);
    });
}

// Cargar los gastos cuando se cargue la vista
loadExpenses();