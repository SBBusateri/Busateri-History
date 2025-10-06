import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWtAi-Ti7wAwizTcb1h1m5olFysWFotY8",
  authDomain: "busateri-family-history.firebaseapp.com",
  projectId: "busateri-family-history",
  storageBucket: "busateri-family-history.firebasestorage.app",
  messagingSenderId: "801350935251",
  appId: "1:801350935251:web:0c51776cadd0bae5daea26",
  measurementId: "G-JYDZF8FXXD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
