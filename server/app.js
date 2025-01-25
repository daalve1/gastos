const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./server/database.db');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.get('/api/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/api/expenses', (req, res) => {
    const { description, amount, date } = req.body;
    const query = 'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)';
    db.run(query, [description, amount, date], function (err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
