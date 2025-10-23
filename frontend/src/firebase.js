// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-84d5b.firebaseapp.com",
  projectId: "mern-real-estate-84d5b",
  storageBucket: "mern-real-estate-84d5b.firebasestorage.app",
  messagingSenderId: "28226271891",
  appId: "1:28226271891:web:0fa4956795f2aebb6eeb66",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
