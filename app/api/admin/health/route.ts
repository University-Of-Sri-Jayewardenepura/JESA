import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const checks: Record<string, boolean | string> = {
    nodeEnv: process.env.NODE_ENV || "unknown",
    hasFirebaseApiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    hasFirebaseProjectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    hasFirebaseAuthDomain: Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    hasServiceAccountJson: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
    hasAdminEmails: Boolean(process.env.ADMIN_EMAILS),
  };

  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      checks.serviceAccountStatus = "missing";
    } else {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      checks.serviceAccountStatus = parsed.project_id
        ? `valid (${parsed.project_id})`
        : "invalid (missing project_id)";
    }
  } catch {
    checks.serviceAccountStatus = "invalid JSON";
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    // A lightweight Firestore operation to confirm Admin SDK connectivity.
    await getAdminDb().collection("admin_users").limit(1).get();
    checks.firebaseAdminStatus = "connected";
  } catch (error) {
    checks.firebaseAdminStatus =
      error instanceof Error ? error.message : "failed";
  }

  return NextResponse.json({
    ok: checks.firebaseAdminStatus === "connected",
    checks,
  });
}
