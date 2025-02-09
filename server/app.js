const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();

// Ruta al archivo de base de datos
const dbPath = process.env.RENDER_EXTERNAL_STORAGE
? path.join(process.env.RENDER_EXTERNAL_STORAGE, 'database.sqlite')
: path.join(__dirname, 'database.sqlite');

// Crear la conexión con la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Si la conexión falla, detener el proceso
    }
    console.log('Conexión exitosa a la base de datos:', dbPath);
});

db.serialize(() => {
    // Crear la tabla 'expenses' si no existe
    db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            expenseType INTEGER NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            comment TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS expenses_types (
            id INTEGER PRIMARY KEY,
            category INTEGER,
            description TEXT NOT NULL
        );
    `);

    const valuesToInsert = [
        { id: 1, category: 1, description: 'Coche' },
        { id: 2, category: 1, description: 'Supermercado' },
        { id: 3, category: 1, description: 'Amazon' },
        { id: 4, category: 1, description: 'Facturas' },
        { id: 5, category: 1, description: 'Restaurantes' },
        { id: 6, category: 1, description: 'Guardería' },
        { id: 7, category: 1, description: 'Netflix' },
        { id: 8, category: 1, description: 'Hipoteca' },
        { id: 9, category: 1, description: 'IBI' },
        { id: 10, category: 1, description: 'Seguro casa' }
    ];

    valuesToInsert.forEach(item => {
        db.run(`INSERT OR IGNORE INTO expenses_types (id, category, description) VALUES (?, ?, ?)`, [item.id, item.category, item.description], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row inserted for ${item.description}`);
        });
    });
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
        console.log('📊 Gastos recuperados:', rows);
        res.json(rows);
    });
});

// Agregar un nuevo gasto
app.post('/api/expenses', (req, res) => {
    console.log('Recibiendo solicitud POST /api/expenses...');
    const { expenseType, amount, date, comment } = req.body;

    // Validaciones de entrada
    if (!expenseType || !amount || !date || !comment) {
        console.error('Faltan campos obligatorios.');
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos son obligatorios.',
        });
    }

    if (amount <= 0) {
        console.error('Monto no válido:', amount);
        return res.status(400).json({
            status: 'error',
            message: 'La cantidad debe ser un número positivo.',
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
            message: 'La fecha no puede ser posterior al día actual.',
        });
    }

    // Consulta para insertar el gasto
    const query = 'INSERT INTO expenses (expenseType, amount, date, comment) VALUES (?, ?, ?, ?)';
    db.run(query, [expenseType, amount, date, comment], function (err) {
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

// Obtener todos los tipos de gasto
app.get('/api/expenses-types', (req, res) => {
    console.log('Recibiendo solicitud GET /api/expenses-types...');
    db.all('SELECT * FROM expenses_types ORDER BY description ASC', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los tipos de gasto:', err.message);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener los tipos de gasto.',
            });
        }
        res.json(rows);
    });
});

// Redirige cualquier ruta desconocida al index para manejo del lado del cliente
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
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
