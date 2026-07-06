import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function initFirebaseAdmin() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return initializeApp();
}

const app = initFirebaseAdmin();
export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
