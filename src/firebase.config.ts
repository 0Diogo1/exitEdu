import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDRO0HMXHJwpLzHoSF850FteqXBxl8DN0Y",
  authDomain: "login-chamada-app.firebaseapp.com",
  projectId: "login-chamada-app",
  storageBucket: "login-chamada-app.firebasestorage.app",
  messagingSenderId: "38335697920",
  appId: "1:38335697920:web:49983d1399e923438c34e5"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase)
export const db = getFirestore();