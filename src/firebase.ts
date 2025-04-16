// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // Add Firestore import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOrZRhIzqTfz4vsl577bhPANqPocmt44Q",
  authDomain: "group-fund-b50fa.firebaseapp.com",
  projectId: "group-fund-b50fa",
  storageBucket: "group-fund-b50fa.firebasestorage.app",
  messagingSenderId: "8020642876",
  appId: "1:8020642876:web:02936ae21e772b88c18739",
  measurementId: "G-ZD7PWDE6D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { db };  // Export Firestore as db