// Initialize Firebase from your earlier snippet
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Manejo del registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;

  auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
    // Usuario creado y registrado
    console.log("Usuario registrado");
  }).catch((error) => {
    console.error("Error: ", error.message);
  });
});

// Manejo del inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    // Usuario autenticado
    console.log("Usuario autenticado");
  }).catch((error) => {
    console.error("Error: ", error.message);
  });
});
