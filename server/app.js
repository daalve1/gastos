const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();

// Ruta al archivo de base de datos
const dbPath = path.join(__dirname, 'database.sqlite');

// Crear la conexión con la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Si la conexión falla, detener el proceso
    }
    console.log('Conexión exitosa a la base de datos:', dbPath);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas

// Eliminar un gasto
app.delete('/api/expenses/delete/:id', (req, res) => {
    console.log('Recibiendo solicitud DELETE /api/expenses/delete/:id...');
    const { id } = req.params;

    // Consulta para eliminar el gasto
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error al eliminar el gasto:', err.message);
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar el gasto.',
            });
        }
        res.json({ id: this.changes });
    });
});

// Obtener todos los gastos
app.get('/api/expenses', (req, res) => {
    console.log('Recibiendo solicitud GET /api/expenses...');
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los gastos:', err.message);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener los gastos.',
            });
        }
        res.json(rows);
    });
});

// Agregar un nuevo gasto
app.post('/api/expenses', (req, res) => {
    console.log('Recibiendo solicitud POST /api/expenses...');
    const { description, amount, date } = req.body;

    // Validaciones de entrada
    if (!description || !amount || !date) {
        console.error('Faltan campos obligatorios.');
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos (description, amount, date) son obligatorios.',
        });
    }

    if (amount <= 0) {
        console.error('Monto no válido:', amount);
        return res.status(400).json({
            status: 'error',
            message: 'El monto debe ser un número positivo.',
        });
    }

    const currentDate = new Date();
    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())) {
        console.error('Fecha no válida:', date);
        return res.status(400).json({
            status: 'error',
            message: 'La fecha no es válida.',
        });
    }

    if (inputDate > currentDate || inputDate < new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))) {
        console.error('Fecha fuera de rango:', date);
        return res.status(400).json({
            status: 'error',
            message: 'La fecha debe estar dentro del último año y no ser futura.',
        });
    }

    // Consulta para insertar el gasto
    const query = 'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)';
    db.run(query, [description, amount, date], function (err) {
        if (err) {
            console.error('Error al agregar el gasto:', err.message);
            return res.status(500).json({
                status: 'error',
                message: 'Error al agregar el gasto.',
            });
        }
        res.json({ id: this.lastID });
    });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error global:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error en el servidor. Por favor, intenta de nuevo más tarde.',
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
