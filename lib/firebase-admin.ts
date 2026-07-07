import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

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
let authInstance: Auth | null = null;

export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(createFirebaseAdminApp());
  }
  return dbInstance;
}

export function getAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(createFirebaseAdminApp());
  }
  return authInstance;
}


