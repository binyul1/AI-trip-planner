// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFMgRni0JKU7fNNgBpGgcSnOOVTi5awwE",
  authDomain: "ai-trip-planner-5eafb.firebaseapp.com",
  projectId: "ai-trip-planner-5eafb",
  storageBucket: "ai-trip-planner-5eafb.firebasestorage.app",
  messagingSenderId: "160560471153",
  appId: "1:160560471153:web:30eba29e7f00d15398cfd0",
  measurementId: "G-XH1V7EC39F",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
