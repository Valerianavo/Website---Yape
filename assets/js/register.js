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


emailjs.init("98E6uq6a3OOJzKCjf");

async function enviarCodigoVerificacion(email, codigo) {
    try {
        await emailjs.send("Yape", "template_lp4051m", { codigo, to_email: email });
        showMessage("Código enviado a tu correo.", "success");
    } catch (error) {
        showMessage("Error al enviar el correo.", "error");
    }
}

async function generarCodigo(uid, email) {
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000);
    await updateDoc(doc(db, "usuarios", uid), { codigoVerificacion: nuevoCodigo });
    console.log("✅ Nuevo código de verificación generado:", nuevoCodigo);
    await enviarCodigoVerificacion(email, nuevoCodigo);
}

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

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

                const codigoVerificacion = Math.floor(100000 + Math.random() * 900000);

                await setDoc(doc(db, "usuarios", user.uid), {
                    nombre, email, telefono, pregunta, respuesta,
                    bloqueado: true, verificado: false, codigoVerificacion
                });

                console.log("✅ Usuario creado con UID:", user.uid);
                await enviarCodigoVerificacion(email, codigoVerificacion);

                window.location.href = `verificar.html?uid=${user.uid}`;
            } catch (error) {
                showMessage(manejarErrores(error), "error");
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

                await updateDoc(userRef, { bloqueado: true });

                if (userData.bloqueado) {
                    showMessage("Tu cuenta está bloqueada. Debes desbloquearla antes de continuar.", "error");
                    return;
                }
                await generarCodigo(user.uid, email);

                if (!user.emailVerified) {
                    showMessage("Nuevo código enviado. Verifica tu correo.", "info");
                    setTimeout(() => {
                        window.location.href = `verificar.html?uid=${user.uid}`;
                    }, 2000);
                    return;
                }

                showMessage("Nuevo código enviado. Redirigiendo al dashboard...", "success");
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);

            } catch (error) {
                showMessage(manejarErrores(error), "error");
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
    const errores = {
        "auth/email-already-in-use": "El correo ya está en uso.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
        "auth/invalid-email": "El correo no es válido.",
        "auth/invalid-credential": "Credenciales incorrectas."
    };
    return errores[error.code] || "Ocurrió un error. Inténtalo de nuevo.";
}


document.addEventListener("DOMContentLoaded", function () {
    const toggleForms = () => {
        document.getElementById('register-section').classList.toggle('d-none');
        document.getElementById('login-section').classList.toggle('d-none');
    };

    document.getElementById("register-form").addEventListener("submit", function(event) {
        const email = document.getElementById("register-email").value;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!regex.test(email)) {
            alert("Por favor, ingrese un correo válido.");
            event.preventDefault();
        }
    });

    window.toggleForms = toggleForms;
});