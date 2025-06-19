import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8alKelxvf0HOb4KFXI1Co2eKsEsuTxxY",
  authDomain: "phone-fusion-360a3.firebaseapp.com",
  projectId: "phone-fusion-360a3",
  storageBucket: "phone-fusion-360a3.firebasestorage.app",
  messagingSenderId: "463266818587",
  appId: "1:463266818587:web:eb1958cb32fcd2d5dee6be",
  measurementId: "G-1M1HJDESDR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);