// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chat-example-e397a.firebaseapp.com",
  projectId: "chat-example-e397a",
  storageBucket: "chat-example-e397a.appspot.com",
  messagingSenderId: "472454512502",
  appId: "1:472454512502:web:081f3fa78034da9afe8457",
  measurementId: "G-ZMMX02VSEZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
