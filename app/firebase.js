// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBCXJARsAqwQ-3tc6tfJ6bgLG6hPW1T_ZQ',
  authDomain: 'inventory-management-a8cf1.firebaseapp.com',
  projectId: 'inventory-management-a8cf1',
  storageBucket: 'inventory-management-a8cf1.appspot.com',
  messagingSenderId: '422164632468',
  appId: '1:422164632468:web:340909029f4f77b25df581',
  measurementId: 'G-K6HR3C54S3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
