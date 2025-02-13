// Función async para cargar los tipos de gasto y poblar el select
export async function getTiposDeGasto() {
    // Obtenemos los tipos de gasto de la api
    const response = await fetch('/api/expenses-types');

    // Comprobamos que no haya ocurrido un error
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Lanza un error si la respuesta HTTP no es exitosa
    }

    // Devolvemos los datos
    return await response.json();
}

export function obtenerDescripcionPorId(id, array) {
    const objeto = array.find(item => item.id === id);
    return objeto ? objeto.description : null;
}