// firebase.js 또는 firebase.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Firestore 추가

const firebaseConfig = {
  apiKey: "AIzaSyBvGr6jjKDIqjllAPunnJSDHq7Ojr63s0c",
  authDomain: "react-tims.firebaseapp.com",
  projectId: "react-tims",
  storageBucket: "react-tims.firebasestorage.app",
  messagingSenderId: "124772059232",
  appId: "1:124772059232:web:58d6c73b87341a79725b05",
  measurementId: "G-CGWQPL20TL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Firestore 인스턴스 초기화
const db = getFirestore(app);

export { db };
