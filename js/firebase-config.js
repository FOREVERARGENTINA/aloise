/**
 * CONFIGURACIÓN DE FIREBASE
 * Gabriela Aloise Propiedades
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y',
  authDomain: 'frandoweb-4c2c7.firebaseapp.com',
  projectId: 'frandoweb-4c2c7',
  storageBucket: 'frandoweb-4c2c7.firebasestorage.app',
  messagingSenderId: '227831202965',
  appId: '1:227831202965:web:10f9ca4f2a4f5080f7c79c',
  measurementId: 'G-1X8T159RTT'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export Firebase services for use in other modules
export { app, analytics, db, storage, auth };

// Make Firebase available globally (for non-module scripts)
if (typeof window !== 'undefined') {
  window.firebase = {
    app,
    analytics,
    db,
    storage,
    auth
  };
}
