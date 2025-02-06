// Función para mostrar el toast
export function showToast(message, type = 'danger') {
    const toastElement = document.getElementById('toastMessage');
    const toastContent = document.getElementById('toastContent');

    toastContent.textContent = message;

    // Cambia el color de fondo según el tipo de mensaje
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}