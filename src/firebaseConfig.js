// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRj8FUTndKy2XyBAVBgkKco4Kqzb1LxjM",
  authDomain: "mi-app-modular-96fcf.firebaseapp.com",
  projectId: "mi-app-modular-96fcf",
  storageBucket: "mi-app-modular-96fcf.firebasestorage.app",
  messagingSenderId: "1001851538546",
  appId: "1:1001851538546:web:6d1c8f5dfcd28af19cc6eb",
  measurementId: "G-75JR1167ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app);