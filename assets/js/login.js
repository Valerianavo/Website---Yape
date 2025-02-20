import { auth, db } from "./config.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { showMessage } from "./toastMessage.js";

document.addEventListener("DOMContentLoaded", () => {
    const desbloqueoForm = document.getElementById("desbloqueo-form");

    if (desbloqueoForm) {
        desbloqueoForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const telefono = document.getElementById("telefono").value.trim();
            const respuesta = document.getElementById("respuesta").value.trim();

            try {
                // Autenticar al usuario para obtener su UID
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const uid = user.uid; // Obtener el UID

                // Buscar el usuario en Firestore con su UID
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
                    await updateDoc(userDocRef, { bloqueado: false });

                    desbloqueoForm.style.display = "none";
                    document.getElementById("mensaje-exitoso").style.display = "block";
                    showMessage("Cuenta desbloqueada con éxito", "success");
                } else {
                    showMessage("Datos incorrectos. Inténtalo de nuevo.", "error");
                }
            } catch (error) {
                showMessage("Error al desbloquear: " + error.message, "error");
            }
        });
    }
    
});


