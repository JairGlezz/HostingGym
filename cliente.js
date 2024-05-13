firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const clienteForm = document.getElementById('clienteForm');
const clientesList = document.getElementById('clientesList');
let updateStatus = false;
let idUpdate = '';

clienteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = clienteForm['nombre'].value;
    const email = clienteForm['email'].value;

    if (!updateStatus) {
        db.collection('clientes').add({
            nombre, 
            email
        });
    } else {
        updateCliente(idUpdate, { nombre, email });
    }

    clienteForm.reset();
});

function updateCliente(id, updateCliente) {
    db.collection('clientes').doc(id).update(updateCliente);
    updateStatus = false;
    idUpdate = '';
}

function deleteCliente(id) {
    db.collection('clientes').doc(id).delete();
}

db.collection('clientes').onSnapshot((querySnapshot) => {
    clientesList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        clientesList.innerHTML += `<tr>
            <td>${doc.data().nombre}</td>
            <td>${doc.data().email}</td>
            <td>
                <button class="btn btn-primary" onclick="fillForm('${doc.id}', '${doc.data().nombre}', '${doc.data().email}')">Editar</button>
                <button class="btn btn-danger" onclick="deleteCliente('${doc.id}')">Eliminar</button>
            </td>
        </tr>`;
    });
});

function fillForm(id, nombre, email) {
    clienteForm['nombre'].value = nombre;
    clienteForm['email'].value = email;
    updateStatus = true;
    idUpdate = id;
}
