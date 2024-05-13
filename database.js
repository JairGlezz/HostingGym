const sqlite3 = require('sqlite3').verbose();

// Crear una nueva base de datos o abrir una existente
const db = new sqlite3.Database('./gymdb.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos gymdb.');
});

// Crear tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`);

module.exports = db;
