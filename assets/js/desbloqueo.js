const btnDesbloqueo = document.getElementById("btn-desbloquear");
if (btnDesbloqueo) {
    btnDesbloqueo.addEventListener("click", () => {
        window.location.href = "login.html";  
    });
}