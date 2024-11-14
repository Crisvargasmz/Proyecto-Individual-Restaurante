import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase aquí
const firebaseConfig = {
    apiKey: "AIzaSyBdTboZqieJgERZ9iMWpdODCGnP-QxJXrI",
    authDomain: "restaurante-be6e2.firebaseapp.com",
    projectId: "restaurante-be6e2",
    storageBucket: "restaurante-be6e2.firebasestorage.app",
    messagingSenderId: "517613017395",
    appId: "1:517613017395:web:3b7ce37c62061a196f8646"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
