// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWtAi-Ti7wAwizTcb1h1m5olFysWFotY8",
  authDomain: "busateri-family-history.firebaseapp.com",
  projectId: "busateri-family-history",
  storageBucket: "busateri-family-history.firebasestorage.app",
  messagingSenderId: "801350935251",
  appId: "1:801350935251:web:0c51776cadd0bae5daea26",
  measurementId: "G-JYDZF8FXXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);