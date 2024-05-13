document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Usuario registrado con ID ' + data.id);
        fetchUsers(); // Recarga la lista de usuarios
    })
    .catch(error => console.error('Error:', error));
});

function fetchUsers() {
    fetch('/users')
    .then(response => response.json())
    .then(users => {
        const table = document.getElementById('usersTable');
        table.innerHTML = '<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr>';
        users.forEach(user => {
            const row = table.insertRow(-1);
            row.insertCell(0).innerText = user.id;
            row.insertCell(1).innerText = user.name;
            row.insertCell(2).innerText = user.email;
            let actions = row.insertCell(3);
            actions.innerHTML = `<button onclick="deleteUser(${user.id})">Eliminar</button>`;
        });
    })
    .catch(error => console.error('Error:', error));
}

function deleteUser(userId) {
    fetch(`/users/${userId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(message => {
        alert(message.message);
        fetchUsers(); // Recarga la lista de usuarios
    })
    .catch(error => console.error('Error:', error));
}

window.onload = fetchUsers; // Carga la lista de usuarios al cargar la página

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

function fetchUsers() {
    fetch('/users')
    .then(response => response.json())
    .then(users => {
        const table = document.getElementById('usersTable');
        table.innerHTML = '<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr>';
        users.forEach(user => {
            const row = table.insertRow(-1);
            row.insertCell(0).innerText = user.id;
            row.insertCell(1).innerText = user.name;
            row.insertCell(2).innerText = user.email;
            let actions = row.insertCell(3);
            actions.innerHTML = `<button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Editar</button> <button onclick="deleteUser(${user.id})">Eliminar</button>`;
        });
    })
    .catch(error => console.error('Error:', error));
}

function editUser(id, name, email) {
    const newName = prompt("Editar nombre:", name);
    const newEmail = prompt("Editar email:", email);
    if (newName && newEmail) {
        fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, email: newEmail }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario actualizado');
            fetchUsers(); // Recarga la lista de usuarios
        })
        .catch(error => console.error('Error:', error));
    }
}
const express = require('express');
const db = require('./database.js');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// GET - Listar todos los usuarios
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// POST - Crear un nuevo usuario
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Usuario registrado", "id": this.lastID });
    });
});

// Aquí seguirías con los demás métodos PUT y DELETE

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
