export const showMessage = (mensaje, tipo) => {
    Toastify({
      text: mensaje,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          tipo === "error"
            ? "linear-gradient(to right, #b182e3, #7d2fd0)"
            : "linear-gradient(to right, #45cea2, #289b76)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  };