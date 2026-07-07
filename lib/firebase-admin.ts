import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { verifyFirebaseIdToken, type DecodedIdToken } from "./firebase-token-verifier";

let cachedApp: App | null = null;

function createFirebaseAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      );
      cachedApp = initializeApp({
        credential: cert(serviceAccount),
      });
      return cachedApp;
    } catch (error) {
      console.error(
        "[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
        error
      );
      throw new Error(
        "Invalid FIREBASE_SERVICE_ACCOUNT_JSON environment variable"
      );
    }
  }

  // Application Default Credentials (works in Google Cloud / local gcloud auth)
  cachedApp = initializeApp();
  return cachedApp;
}

let dbInstance: Firestore | null = null;

export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(createFirebaseAdminApp());
  }
  return dbInstance;
}

// Drop-in replacement for firebase-admin/auth that avoids the jose/jwks-rsa
// ESM/CJS bundling conflict on Vercel. Verifies tokens with jsonwebtoken using
// Google's published public keys.
export function getAdminAuth(): {
  verifyIdToken(token: string): Promise<DecodedIdToken>;
} {
  return {
    verifyIdToken: verifyFirebaseIdToken,
  };
}
