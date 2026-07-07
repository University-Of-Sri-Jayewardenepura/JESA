import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const superAdminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
    "warunaudarasam2003@gmail.com",
  ];

export type AdminStatus = "approved" | "pending" | "rejected" | "not_found";

export interface AdminUser {
  uid: string;
  email: string;
  name?: string;
  isSuperAdmin: boolean;
  status: AdminStatus;
}

export interface AdminRecord {
  uid: string;
  email: string;
  name?: string;
  status: AdminStatus;
  requestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

function getTokenFromCookieHeader(
  cookieHeader: string | null
): string | undefined {
  if (!cookieHeader) return undefined;
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("__session="))
    ?.split("=")[1];
}

export function isSuperAdmin(email: string): boolean {
  return superAdminEmails.includes(email);
}

async function checkAdminStatus(
  uid: string,
  email: string
): Promise<{ status: AdminStatus; record?: AdminRecord }> {
  if (isSuperAdmin(email)) {
    return { status: "approved" };
  }

  const doc = await getAdminDb().collection("admin_users").doc(uid).get();
  if (!doc.exists) {
    return { status: "not_found" };
  }

  const data = doc.data();
  const record: AdminRecord = {
    uid,
    email: data?.email || email,
    name: data?.name,
    status: data?.status || "pending",
    requestedAt: data?.requestedAt?._seconds
      ? new Date(data.requestedAt._seconds * 1000).toISOString()
      : undefined,
    approvedBy: data?.approvedBy,
    approvedAt: data?.approvedAt?._seconds
      ? new Date(data.approvedAt._seconds * 1000).toISOString()
      : undefined,
  };

  return { status: record.status, record };
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<AdminUser | null> {
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!decoded.email) return null;

    const superAdmin = isSuperAdmin(decoded.email);
    if (superAdmin) {
      return {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || undefined,
        isSuperAdmin: true,
        status: "approved",
      };
    }

    const { status } = await checkAdminStatus(decoded.uid, decoded.email);
    if (status !== "approved") return null;

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || undefined,
      isSuperAdmin: false,
      status: "approved",
    };
  } catch {
    return null;
  }
}

export async function getAdminUserFromCookies(): Promise<AdminUser | null> {
  const token = (await cookies()).get("__session")?.value;
  return verifyAdminToken(token);
}

export async function getAdminUserFromRequest(
  request: Request
): Promise<AdminUser | null> {
  const cookieHeader = request.headers.get("cookie");
  const token = getTokenFromCookieHeader(cookieHeader);
  return verifyAdminToken(token);
}

export async function requestAdminAccess(
  token: string
): Promise<{ status: AdminStatus; record?: AdminRecord }> {
  const decoded = await getAdminAuth().verifyIdToken(token);
  if (!decoded.email) {
    throw new Error("Invalid token: no email");
  }

  if (isSuperAdmin(decoded.email)) {
    return { status: "approved" };
  }

  const { status, record } = await checkAdminStatus(decoded.uid, decoded.email);

  if (status === "approved" || status === "pending" || status === "rejected") {
    return { status, record };
  }

  // New user: create a pending request
  const docRef = getAdminDb().collection("admin_users").doc(decoded.uid);
  const newRecord: AdminRecord = {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name || undefined,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };

  await docRef.set(newRecord);
  return { status: "pending", record: newRecord };
}

export async function listAdminRequests(
  token: string
): Promise<AdminRecord[]> {
  const decoded = await getAdminAuth().verifyIdToken(token);
  if (!decoded.email || !isSuperAdmin(decoded.email)) {
    throw new Error("Forbidden");
  }

  const snapshot = await getAdminDb()
    .collection("admin_users")
    .orderBy("requestedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email,
      name: data.name,
      status: data.status,
      requestedAt: data.requestedAt?._seconds
        ? new Date(data.requestedAt._seconds * 1000).toISOString()
        : data.requestedAt,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt?._seconds
        ? new Date(data.approvedAt._seconds * 1000).toISOString()
        : data.approvedAt,
    };
  });
}

export async function updateAdminStatus(
  token: string,
  targetUid: string,
  status: "approved" | "rejected",
  options?: { revoke?: boolean }
): Promise<void> {
  const decoded = await getAdminAuth().verifyIdToken(token);
  if (!decoded.email || !isSuperAdmin(decoded.email)) {
    throw new Error("Forbidden");
  }

  const docRef = getAdminDb().collection("admin_users").doc(targetUid);
  const doc = await docRef.get();

  if (status === "rejected" && options?.revoke) {
    // Revoke access by deleting the record or setting to rejected
    await docRef.delete();
    return;
  }

  const update: Record<string, unknown> = { status };
  if (status === "approved") {
    update.approvedBy = decoded.email;
    update.approvedAt = new Date().toISOString();
  }

  if (doc.exists) {
    await docRef.update(update);
  } else {
    await docRef.set({
      status,
      approvedBy: decoded.email,
      approvedAt: new Date().toISOString(),
    });
  }
}
