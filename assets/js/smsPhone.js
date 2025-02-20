// // Función para enviar un mensaje de texto con un código de verificación
// async function sendVerificationCode(phoneNumber) {
//     const verificationId = await firebase.auth().fetchRecaptchaVerifier('recaptcha-container', {
//       render: () => {
//         document.getElementById('recaptcha-container').innerHTML = '';
//       }
//     }).verify(phoneNumber, {
//       timeout: 60000,
//       // forceSms: true,
//     });
//     console.log(verificationId);
//     const code = await firebase.auth().signInWithPhoneNumber(phoneNumber, verificationId);
//     console.log(code);
//   }

//   // Función para verificar el código de verificación
// async function verifyCode(code, verificationId) {
//     try {
//       const result = await firebase.auth().signInWithCode(verificationId, code);
//       console.log(result);
//       // Inicio de sesión exitoso
//     } catch (error) {
//       console.error(error);
//     }
//   }

// // Event listener para enviar el mensaje de texto
// document.getElementById('send-code').addEventListener('click', async () => {
//     const phoneNumber = document.getElementById('phoneNumber').value;
//     await sendVerificationCode(phoneNumber);
//   });
  
//   // Event listener para verificar el código de verificación
//   document.getElementById('verify-code').addEventListener('click', async () => {
//     const code = document.getElementById('code').value;
//     const verificationId = firebase.auth().getCurrentUser().verificationId;
//     await verifyCode(code, verificationId);
//   });

// import { auth } from "./config.js";
// import { signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// // Configurar reCAPTCHA
// const configurarRecaptcha = () => {
//   window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//     'size': 'invisible',
//     'callback': (response) => {
//       console.log("reCAPTCHA verificado");
//     }
//   });
// };

// // Evento para enviar el código SMS
// document.getElementById("send-code").addEventListener("click", (e) => {
//   e.preventDefault();
  
//   let phoneNumber = document.getElementById("phoneNumber").value.trim();
  
//   // Validar que el número sea de Perú (+51)
//   if (!phoneNumber.startsWith("+51")) {
//     phoneNumber = "+51" + phoneNumber;
//   }

//   // Expresión regular para validar números de Perú (9 dígitos después del +51)
//   const peruPhoneRegex = /^\+51[9][0-9]{8}$/;

//   if (!peruPhoneRegex.test(phoneNumber)) {
//     alert("Por favor, ingresa un número de teléfono válido de Perú (debe comenzar con +51 y tener 9 dígitos después).");
//     return;
//   }

//   configurarRecaptcha();
//   const appVerifier = window.recaptchaVerifier;

//   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       window.confirmationResult = confirmationResult;
//       alert("Código enviado al número " + phoneNumber);
//     })
//     .catch((error) => {
//       console.error("Error al enviar el código:", error);
//       alert("Error al enviar el código. Verifica el número e intenta de nuevo.");
//     });
// });

// // Evento para verificar el código SMS
// document.getElementById("verify-code").addEventListener("click", (e) => {
//   e.preventDefault();
  
//   const code = document.getElementById("code").value.trim();

//   if (!code) {
//     alert("Por favor, ingresa el código recibido.");
//     return;
//   }

//   window.confirmationResult.confirm(code)
//     .then((result) => {
//       const user = result.user;
//       alert("¡Verificación exitosa! Usuario autenticado: " + user.phoneNumber);
//     })
//     .catch((error) => {
//       console.error("Código incorrecto:", error);
//       alert("Código incorrecto. Intenta de nuevo.");
//     });
// });
