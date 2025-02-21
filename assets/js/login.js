import { auth, db } from "./config.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { showMessage } from "./toastMessage.js";

document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("98E6uq6a3OOJzKCjf"); // Inicializa EmailJS

    const desbloqueoForm = document.getElementById("desbloqueo-form");
    const verificacionDiv = document.getElementById("verificacion");
    const verificarCodigoBtn = document.getElementById("verificar-codigo");

    if (desbloqueoForm) {
        desbloqueoForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const telefono = document.getElementById("telefono").value.trim();
            const respuesta = document.getElementById("respuesta").value.trim();

            try {
                // Autenticar al usuario
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const uid = user.uid;

                // Obtener datos del usuario desde Firestore
                const userDocRef = doc(db, "usuarios", uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    showMessage("Usuario no encontrado", "error");
                    return;
                }

                const userData = userDoc.data();

                if (!userData.bloqueado) {
                    showMessage("Esta cuenta no está bloqueada", "info");
                    return;
                }

                // Verificar datos adicionales
                if (userData.telefono === telefono && userData.respuesta === respuesta) {
                    // Generar un código aleatorio de 6 dígitos
                    const codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();

                    // Guardar el código en Firestore
                    await updateDoc(userDocRef, { codigoVerificacion: codigoGenerado });

                    // Enviar código al correo con EmailJS
                    const emailParams = {
                        to_email: email,
                        user_name: userData.nombre,
                        codigo: codigoGenerado, // Código único para desbloquear la cuenta
                    };

                    emailjs.send("Yape", "template_d7haqo3", emailParams)
                        .then(() => {
                            showMessage("Código de verificación enviado a tu correo", "success");
                        })
                        .catch((error) => {
                            console.error("Error al enviar el correo:", error);
                            showMessage("No se pudo enviar el correo", "error");
                        });

                    // Ocultar formulario y mostrar campo de verificación
                    desbloqueoForm.style.display = "none";
                    verificacionDiv.style.display = "block";
                } else {
                    showMessage("Datos incorrectos. Inténtalo de nuevo.", "error");
                }
            } catch (error) {
                showMessage("Error al procesar desbloqueo: " + error.message, "error");
            }
        });
    }

    if (verificarCodigoBtn) {
        verificarCodigoBtn.addEventListener("click", async () => {
            const email = document.getElementById("email").value.trim();
            const codigoIngresado = document.getElementById("codigo").value.trim();
        
            try {
                const user = auth.currentUser;
                if (!user) {
                    showMessage("Usuario no autenticado", "error");
                    return;
                }
        
                const uid = user.uid;
                const userDocRef = doc(db, "usuarios", uid);
                const userDoc = await getDoc(userDocRef);
        
                if (!userDoc.exists()) {
                    showMessage("Usuario no encontrado", "error");
                    return;
                }
        
                const userData = userDoc.data();

                if (userData.codigoVerificacion === codigoIngresado) {
                    // Actualizar Firestore: Desbloquear la cuenta y eliminar el código de verificación
                    await updateDoc(userDocRef, { bloqueado: false, codigoVerificacion: null });
        
                    // Ocultar la sección de verificación
                    verificacionDiv.style.display = "none";
        
                    // Mostrar la sección de éxito
                    document.getElementById("mensaje-exitoso").style.display = "block";
        
                    showMessage("Cuenta desbloqueada con éxito", "success");
                } else {
                    showMessage("Código incorrecto. Inténtalo de nuevo.", "error");
                }
            } catch (error) {
                showMessage("Error al verificar código: " + error.message, "error");
            }
        });        
    }
});



