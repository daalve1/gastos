// Mostrar mensajes de error con un Toast
function showErrorToast(message) {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    const toast = new bootstrap.Toast(document.getElementById('error-toast'));
    toast.show();
}