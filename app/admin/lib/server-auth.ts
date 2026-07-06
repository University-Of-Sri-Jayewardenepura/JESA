import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
    "warunaudarasam2003@gmail.com",
  ];

interface AdminUser {
  uid: string;
  email: string;
  name?: string;
}

function getTokenFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("__session="))
    ?.split("=")[1];
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<AdminUser | null> {
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded.email || !adminEmails.includes(decoded.email)) {
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || undefined,
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
