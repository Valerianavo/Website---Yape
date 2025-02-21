import { db } from "./config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const verificarForm = document.getElementById("verificar-form");
    const mensaje = document.getElementById("mensaje");

    // 🔹 Obtener UID desde la URL
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    if (!uid) {
        mensaje.innerText = "Error: No se encontró el usuario.";
        return;
    }

    verificarForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const codigoIngresado = document.getElementById("codigo-input").value.trim();

        try {
            // 🔹 Obtener datos del usuario en Firestore
            const userDoc = await getDoc(doc(db, "usuarios", uid));

            if (!userDoc.exists()) {
                mensaje.innerText = "Error: Usuario no encontrado.";
                return;
            }

            const userData = userDoc.data();

            // 🔹 Verificar el código ingresado
            if (userData.codigoVerificacion == codigoIngresado) {
                await updateDoc(doc(db, "usuarios", uid), { verificado: true });

                mensaje.innerText = "Cuenta verificada con éxito. Redirigiendo...";
                setTimeout(() => window.location.href = "../html/terminos.html", 2000);
            } else {
                mensaje.innerText = "Código incorrecto. Intenta de nuevo.";
            }
        } catch (error) {
            console.error(error);
            mensaje.innerText = "Ocurrió un error. Intenta más tarde.";
        }
    });
});



