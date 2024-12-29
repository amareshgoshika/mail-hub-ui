// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAMsnOaLl4ZsiZPhKacuUdasBE2TkLMrF8",
  authDomain: "mailhub-a728a.firebaseapp.com",
  projectId: "mailhub-a728a",
  storageBucket: "mailhub-a728a.firebasestorage.app",
  messagingSenderId: "1096555948490",
  appId: "1:1096555948490:web:977bbdbc2f9f8afb97c733",
  measurementId: "G-EVQW7M9BZF"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, addDoc, collection };