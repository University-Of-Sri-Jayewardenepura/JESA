import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const email = process.argv[2];

if (!email) {
  console.error("Usage: bun run scripts/seed-admin.ts <email>");
  process.exit(1);
}

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!rawServiceAccount) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON env var");
  process.exit(1);
}

let serviceAccount: Record<string, unknown>;
try {
  serviceAccount = JSON.parse(rawServiceAccount);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
  });
}

const db = getFirestore();

async function main() {
  // Look up the Firebase Auth user by email to get their UID.
  const { getAuth } = await import("firebase-admin/auth");
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);

  const docRef = db.collection("admin_users").doc(user.uid);
  const now = new Date().toISOString();

  await docRef.set({
    uid: user.uid,
    email: user.email,
    name: user.displayName || undefined,
    status: "approved",
    role: "super_admin",
    requestedAt: now,
    approvedAt: now,
    approvedBy: "manual_seed",
  });

  console.log(`Created/updated admin_users/${user.uid} for ${email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
