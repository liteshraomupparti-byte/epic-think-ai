/**
 * Epic Think AI - Firebase Configuration & Core Initialization
 * 
 * Uses official Firebase Web SDK v11 (ESM)
 * Connected to project: epic-think
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Official Firebase Web Client Configuration for Epic Think AI
export const firebaseConfig = {
  projectId: "epic-think",
  appId: "1:985150264853:web:62bcc12357f0094471601c",
  databaseURL: "https://epic-think-default-rtdb.firebaseio.com",
  storageBucket: "epic-think.firebasestorage.app",
  apiKey: "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA",
  authDomain: "epic-think.firebaseapp.com",
  messagingSenderId: "985150264853",
  projectNumber: "985150264853"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Ensure local persistence across browser reloads
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.warn("Failed to set auth persistence:", err);
});

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
