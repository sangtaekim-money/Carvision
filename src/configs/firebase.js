import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAyPbzsa5G6LYZSf52T1Ig51Pw-5Xywys",
  authDomain: "cars-1c16c.firebaseapp.com",
  projectId: "cars-1c16c",
  storageBucket: "cars-1c16c.firebasestorage.app",
  messagingSenderId: "617665894030",
  appId: "1:617665894030:web:6b2f5cf0891e45adccdbdf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);