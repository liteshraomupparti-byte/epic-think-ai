/**
 * Epic Think AI - Firebase Authentication Token Verification Middleware
 * 
 * Verifies Firebase ID Tokens server-side to guarantee that:
 * 1. Every incoming request is authenticated with a valid Firebase session
 * 2. The Firebase UID is cryptographically verified (never trusted blindly from client)
 * 3. Hindsight memory banks are isolated per Firebase UID: `epic-think-user-<uid>`
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

let isFirebaseInitialized = false;

// Attempt to initialize Firebase Admin SDK
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id || 'epic-think'
    });
    isFirebaseInitialized = true;
    console.log('[FIREBASE:AUTH] Firebase Admin SDK initialized with environment service account.');
  } else {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';
    const resolvedPath = path.resolve(serviceAccountPath);

    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'epic-think'
      });
      isFirebaseInitialized = true;
      console.log('[FIREBASE:AUTH] Firebase Admin SDK initialized with service account file.');
    } else {
      // Initialize with project ID
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'epic-think'
      });
      isFirebaseInitialized = true;
      console.log('[FIREBASE:AUTH] Firebase Admin SDK initialized with default project ID.');
    }
  }
} catch (err) {
  console.warn('[FIREBASE:AUTH] Note on Admin SDK initialization:', err.message);
}

/**
 * Verify a Firebase ID token and return user identity
 * 
 * @param {string} idToken - Raw JWT token from client
 * @returns {Promise<{ uid: string, email?: string, name?: string }>}
 */
export async function verifyToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('No authentication token provided.');
  }

  // 1. Try Firebase Admin SDK verification
  if (isFirebaseInitialized) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (decoded && decoded.uid) {
        return {
          uid: decoded.uid,
          email: decoded.email || null,
          name: decoded.name || null
        };
      }
    } catch (err) {
      console.warn('[FIREBASE:AUTH] Admin token verification error:', err.message);
    }
  }

  // 2. Google Identity Toolkit API fallback verification
  try {
    const apiKey = "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA"; // Client Web API key
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        const u = data.users[0];
        return {
          uid: u.localId,
          email: u.email || null,
          name: u.displayName || null
        };
      }
    }
  } catch (err) {
    console.warn('[FIREBASE:AUTH] Identity Toolkit verification fallback error:', err.message);
  }

  throw new Error('Invalid or expired Firebase authentication token.');
}

/**
 * Express middleware to enforce Firebase authentication on protected routes
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or malformed Authorization header. Expected Bearer token.'
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Empty token provided.'
    });
  }

  try {
    const user = await verifyToken(token);
    req.user = user;
    
    // Strict isolation: memory bank ID is uniquely tied to the verified Firebase UID
    req.bankId = `epic-think-user-${user.uid}`;
    
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: ' + (err.message || 'Authentication failed')
    });
  }
}
