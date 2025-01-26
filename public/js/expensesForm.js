// expenseForm.js - Maneja la lógica del formulario de gastos

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    // Validaciones
    if (!description || !amount || !date || amount <= 0) {
        alert('Por favor, rellena todos los campos correctamente.');
        return;
    }

    // Enviar datos al servidor
    const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description,
            amount,
            date,
        }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Gasto registrado con éxito.');
        document.getElementById('expenseForm').reset(); // Resetear el formulario
    } else {
        alert('Error al registrar el gasto: ' + data.message);
    }
});
