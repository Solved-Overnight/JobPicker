import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// import { getFirestore, Firestore } from "firebase/firestore"; // Uncomment if you use Firestore
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you use Analytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATe4aEXAVMmvhHd3h_1SG2H9O5fz6Gg3c",
  authDomain: "so-jobpicker.firebaseapp.com",
  projectId: "so-jobpicker",
  storageBucket: "so-jobpicker.appspot.com", // Corrected storage bucket name if needed
  messagingSenderId: "621314204364",
  appId: "1:621314204364:web:8193f18a6e7b227f22d869",
  measurementId: "G-4G0ZGGXEWV"
};


// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth: Auth = getAuth(app);
// const firestore: Firestore = getFirestore(app); // Uncomment if you use Firestore
// const analytics = getAnalytics(app); // Uncomment if you use Analytics

export { app, auth }; // Export other services like firestore if needed
