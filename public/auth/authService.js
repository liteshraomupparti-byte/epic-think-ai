/**
 * Epic Think AI - Authentication Service Layer
 * 
 * Provides clean, robust authentication actions and maps raw Firebase errors
 * to clear, human-friendly user feedback.
 * 
 * Authentication Providers:
 * 1. Google OAuth
 * 2. Email & Password Sign In
 * 3. Email & Password Sign Up (with Display Name)
 * 4. Password Reset via Email
 */

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth, googleProvider } from "./firebase.js";

/**
 * Human-readable mapping for Firebase Auth error codes
 */
export function formatAuthError(error) {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error.code || "";
  const msg = error.message || "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please verify your credentials and try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a password with at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing. Please try again.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed attempts. You can immediately restore it by resetting your password or try again later.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in your Firebase Console.";
    case "auth/configuration-not-found":
      return "Firebase Authentication is not activated on project 'epic-think'. Please enable it in Firebase Console.";
    case "auth/unauthorized-domain":
      return "Unauthorized domain: The current domain is not authorized. Please access via http://localhost:8080/ or add your domain to Firebase Console > Authentication > Settings > Authorized domains.";
    case "auth/admin-restricted-operation":
      return "This operation is restricted by Firebase project admin settings.";
    case "auth/requires-recent-login":
      return "This operation requires recent authentication. Please sign in again.";
    default:
      if (msg.includes("API key not valid")) {
        return "Firebase API configuration issue. Please check project credentials.";
      }
      return msg.replace(/^Firebase:\s*/, "") || "Authentication failed. Please try again.";
  }
}

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle() {
  console.log("[Auth:Google] Initiating Google popup sign-in...");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("[Auth:Google] Success! Signed in as:", result.user.email);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("[Auth:Google] Failure:", error.code, error.message, error);
    return { user: null, error: formatAuthError(error), rawError: error };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email, password) {
  console.log("[Auth:Email:SignIn] Attempting login for:", email);
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    console.log("[Auth:Email:SignIn] Success! Signed in user:", result.user.uid);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("[Auth:Email:SignIn] Failure:", error.code, error.message, error);
    return { user: null, error: formatAuthError(error), rawError: error };
  }
}

/**
 * Sign up with Email, Password and Display Name
 */
export async function signUpWithEmail(email, password, displayName = "") {
  console.log("[Auth:Email:SignUp] Creating account for:", email);
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName && displayName.trim()) {
      await updateProfile(result.user, {
        displayName: displayName.trim()
      });
    }
    console.log("[Auth:Email:SignUp] Success! New user created:", result.user.uid);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("[Auth:Email:SignUp] Failure:", error.code, error.message, error);
    return { user: null, error: formatAuthError(error), rawError: error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email) {
  console.log("[Auth:PasswordReset] Sending reset email to:", email);
  try {
    await sendPasswordResetEmail(auth, email.trim());
    console.log("[Auth:PasswordReset] Success! Reset email sent.");
    return { success: true, error: null };
  } catch (error) {
    console.error("[Auth:PasswordReset] Failure:", error.code, error.message, error);
    return { success: false, error: formatAuthError(error), rawError: error };
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  console.log("[Auth:SignOut] Signing out current user...");
  try {
    await signOut(auth);
    try { sessionStorage.removeItem('epic_intro_seen'); } catch (_) {}
    console.log("[Auth:SignOut] Successfully signed out.");
    return { success: true, error: null };
  } catch (error) {
    console.error("[Auth:SignOut] Error during sign out:", error);
    return { success: false, error: formatAuthError(error) };
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Get Firebase ID Token for backend authentication
 */
export async function getIdToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(forceRefresh);
}

/**
 * Subscribe to authentication state changes with detailed logging
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("[Auth:State] User signed in:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerId: user.providerData?.[0]?.providerId || "firebase"
      });
    } else {
      console.log("[Auth:State] User is currently signed out.");
    }
    if (typeof callback === "function") {
      callback(user);
    }
  });
}
