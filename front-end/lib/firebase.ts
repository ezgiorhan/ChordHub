// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVPGLG_ISV5YSKNH_noswqeanESy91FsE",
  authDomain: "chordhub-fdccd.firebaseapp.com",
  projectId: "chordhub-fdccd",
  storageBucket: "chordhub-fdccd.firebasestorage.app",
  messagingSenderId: "278362421275",
  appId: "1:278362421275:web:82e249e298b4a9d5e8a0be",
  measurementId: "G-70NFYF067Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);