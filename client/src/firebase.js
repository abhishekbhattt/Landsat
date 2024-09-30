// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-b2828.firebaseapp.com",
  projectId: "mernestate-b2828",
  storageBucket: "mernestate-b2828.appspot.com",
  messagingSenderId: "496082520756",
  appId: "1:496082520756:web:309048fd95dc1c0d8365e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
