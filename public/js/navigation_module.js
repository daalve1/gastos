// Función para cargar una vista en el contenedor principal y su JS asociado
export function loadView(view, script) {
    const contentDiv = document.getElementById('content');
    
    fetch(view)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            
            // Cargar el script específico después de que se haya cargado el HTML
            const scriptTag = document.createElement('script');
            scriptTag.src = script;
            scriptTag.onload = () => {
                console.log(`Script ${script} cargado con éxito.`);
            };
            document.body.appendChild(scriptTag);
        })
        .catch(error => {
            console.error('Error al cargar la vista:', error);
        });
}

// Mostrar u ocultar el menú flotante
function toggleMenu() {
    const menu = document.getElementById('fabMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Manejar clic en el botón flotante
document.getElementById('fab').addEventListener('click', () => {
    toggleMenu(); // Mostrar/ocultar el menú
});

// Manejar clic en las opciones del menú
document.getElementById('addExpenseButton').addEventListener('click', () => {
    loadView('expensesForm.html', 'js/expensesForm.js'); // Cargar el formulario de gastos y su JS
    toggleMenu(); // Cerrar el menú al hacer una selección
});

document.getElementById('viewExpensesButton').addEventListener('click', () => {
    loadView('expensesList.html', 'js/expensesList.js'); // Cargar el listado de gastos y su JS
    toggleMenu(); // Cerrar el menú al hacer una selección
});

