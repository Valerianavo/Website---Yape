// 🔥 Importar Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

// Autenticación
import {
  getAuth,
  signInWithPhoneNumber, RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firestore
import {
  getFirestore, 
  collection,
  doc,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBmrp-WZp3E2o4CRuK4UMn6NAGgxpcijOs",
    authDomain: "website-yape.firebaseapp.com",
    projectId: "website-yape",
    storageBucket: "website-yape.firebasestorage.app",
    messagingSenderId: "81067354981",
    appId: "1:81067354981:web:3e27358e287b1313ff4f8c"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
// Inicializar Autenticacion de Firebase y obtener una referencia del servicio
export const auth = getAuth(app);
// Inicializar Firestore
export const db = getFirestore();





