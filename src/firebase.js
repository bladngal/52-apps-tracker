/**
 * Firebase configuration and initialization
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDP2SfYj48cQFY4kSzmpPxTZ-kK8btt5Pc",
  authDomain: "apps-tracker-da3fb.firebaseapp.com",
  projectId: "apps-tracker-da3fb",
  storageBucket: "apps-tracker-da3fb.firebasestorage.app",
  messagingSenderId: "679770262772",
  appId: "1:679770262772:web:e299729d28867c1054e2a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
