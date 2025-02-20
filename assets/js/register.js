import { auth, db } from "./config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

import { 
    setDoc, 
    doc, 
    getDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

import { showMessage } from "./toastMessage.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const params = new URLSearchParams(window.location.search);
    const bloqueo = params.get("bloqueo") === "true"; // Detectar si el usuario viene a bloquear su cuenta

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = document.getElementById("register-nombre").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const telefono = document.getElementById("register-telefono").value.trim();
            const password = document.getElementById("register-password").value;
            const pregunta = document.getElementById("register-pregunta").value;
            const respuesta = document.getElementById("register-respuesta").value.trim();

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await sendEmailVerification(user);
                console.log("Correo de verificación enviado.");

                await setDoc(doc(db, "usuarios", user.uid), {
                    nombre,
                    email,
                    telefono,
                    pregunta,
                    respuesta,
                    bloqueado: true
                });

                showMessage("Usuario registrado exitosamente", "success");
                window.location.href = "terminos.html";
            } catch (error) {
                manejarErrores(error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userRef = doc(db, "usuarios", user.uid);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    showMessage("Usuario no encontrado", "error");
                    return;
                }

                const userData = userDoc.data();

                if (userData.bloqueado) {
                    showMessage("Tu cuenta está bloqueada. Debes desbloquearla antes de continuar.", "error");
                    return;
                }

                // ✅ Bloquear la cuenta automáticamente después de iniciar sesión
                await bloquearCuenta(user.uid);

                showMessage("Has iniciado sesión. Tu cuenta ha sido bloqueada.", "success");

                window.location.href = "terminos.html";
            } catch (error) {
                manejarErrores(error);
            }
        });
    }
});


async function bloquearCuenta(uid) {
    try {
        await updateDoc(doc(db, "usuarios", uid), { bloqueado: true });
    } catch (error) {
        showMessage("Error al bloquear la cuenta", "error");
    }
}

function manejarErrores(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            showMessage("El correo ya está en uso", "error");
            break;
        case "auth/invalid-email":
            showMessage("Correo inválido", "error");
            break;
        case "auth/weak-password":
            showMessage("Contraseña vulnerable", "error");
            break;
        case "auth/invalid-credential":
            showMessage("Credenciales incorrectas", "error");
            break;
        default:
            showMessage(error.message, "error");
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const toggleForms = () => {
        document.getElementById('register-section').classList.toggle('d-none');
        document.getElementById('login-section').classList.toggle('d-none');
    };

    const validarCorreo = () => {
        const email = document.getElementById("register-email").value;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!regex.test(email)) {
            alert("Por favor, ingrese un correo válido.");
            return false;
        }
    };

    document.getElementById("register-form").addEventListener("submit", function(event) {
        if (!validarCorreo()) {
            event.preventDefault();
        }
    });

    document.getElementById("login-form").addEventListener("submit", function(event) {
        const email = document.getElementById("email").value;
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            alert("Por favor, ingrese un correo válido.");
            event.preventDefault();
        }
    });

    document.querySelectorAll(".toggle-password").forEach(toggle => {
        toggle.addEventListener("click", function () {
            let passwordInput = this.parentElement.nextElementSibling;
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.classList.remove("bi-eye-slash");
                this.classList.add("bi-eye");
            } else {
                passwordInput.type = "password";
                this.classList.remove("bi-eye");
                this.classList.add("bi-eye-slash");
            }
        });
    });

    window.toggleForms = toggleForms;

});

