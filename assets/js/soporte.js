import { db } from "./config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    console.log("Intentando enviar mensaje...");
    console.log("Email:", email);
    console.log("Mensaje:", message);

    if (email === "" || message === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "contactos"), {
            email: email,
            mensaje: message,
            timestamp: serverTimestamp()
        });

        console.log("Mensaje guardado con ID:", docRef.id);

        // Mostrar mensaje de confirmación
        // Mostrar mensaje de confirmación
        const confirmacion = document.getElementById("confirmacion");
        confirmacion.style.display = "block";

        // Limpiar formulario
        document.querySelector("form").reset();

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            confirmacion.style.display = "none";
        }, 4000);

        document.getElementById("confirmacion").style.display = "block";

        // Limpiar formulario
        document.querySelector("form").reset();
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        alert("Hubo un error al enviar tu mensaje. Revisa la consola.");
    }
});

