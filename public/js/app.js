import { validateDescription, validateAmount, validateDate } from './validation.js';

// Manejo del formulario
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    // Validaciones
    const descriptionError = validateDescription(description);
    const amountError = validateAmount(amount);
    const dateError = validateDate(date);

    if (descriptionError) {
        showErrorToast(descriptionError);
        return;
    }
    if (amountError) {
        showErrorToast(amountError);
        return;
    }
    if (dateError) {
        showErrorToast(dateError);
        return;
    }

    // Enviar datos al servidor
    await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount, date }),
    });

    // Recargar lista de gastos
    loadExpenses();

    // Resetear formulario
    document.getElementById('expense-form').reset();
});

// Cargar los gastos al iniciar la página
async function loadExpenses() {
    const res = await fetch('/api/expenses');
    const expenses = await res.json();
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span>${expense.date}:</span> ${expense.description} - <strong>$${expense.amount}</strong>`;
        expenseList.appendChild(li);
    });
}

// Mostrar mensajes de error con un Toast
function showErrorToast(message) {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    const toast = new bootstrap.Toast(document.getElementById('error-toast'));
    toast.show();
}

// Cargar gastos al inicio
loadExpenses();
