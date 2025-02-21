// Selección de los elementos de validación, éxito y términos
const validacionSection = document.getElementById("validacion");
const exitoSection = document.getElementById("exito");
const correoConfirmacion = document.getElementById("correoConfirmacion");
const mainAceptarTerminos = document.getElementById("main-aceptar-terminos");
const terminosContinuar = document.getElementById("continuar");
const headerH1 = document.querySelector(".tyc");

// Selección del botón
const btnAceptarTerminos = document.getElementById("btn-aceptar-terminos");

// Habilitar el botón después de 4 segundos
setTimeout(() => {
    btnAceptarTerminos.disabled = false;  // Se habilita funcionalmente
    btnAceptarTerminos.classList.add("enabled");  // Se actualiza el diseño en CSS
}, 4000);

// Evento de clic para aceptar los términos
btnAceptarTerminos.addEventListener("click", async () => {
    // Ocultar secciones de términos
    mainAceptarTerminos.style.display = "none";
    terminosContinuar.style.display = "none";
    headerH1.style.display = "none";

    // Mostrar sección de validación
    validacionSection.style.display = "block";
    
    setTimeout(() => {
        // Ocultar validación y mostrar éxito
        validacionSection.style.display = "none";
        exitoSection.style.display = "block";

        // Mostrar correo de confirmación (puedes cambiarlo dinámicamente si tienes la variable del usuario)
        correoConfirmacion.textContent = "usuario@example.com";  
    }, 3000);  
});
