const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Servirá archivos estáticos desde la carpeta 'public'

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Conectado a la base de datos en memoria.');
});

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
});

// POST - Crear un nuevo usuario
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ id: this.lastID });
    });
});

// GET - Leer todos los usuarios
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });
});

// PUT - Actualizar un usuario
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, req.params.id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Usuario actualizado' });
    });
});

// DELETE - Eliminar un usuario
app.delete('/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Usuario eliminado' });
    });
});
