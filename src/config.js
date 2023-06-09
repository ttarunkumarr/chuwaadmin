import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDdz5NpQgVQMRNfDh6tgb1Y2ycadwJ25zA",
  authDomain: "resume-sort.firebaseapp.com",
  projectId: "resume-sort",
  storageBucket: "resume-sort.appspot.com",
  messagingSenderId: "25208443480",
  appId: "1:25208443480:web:eee5db11260e2f7411702d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
