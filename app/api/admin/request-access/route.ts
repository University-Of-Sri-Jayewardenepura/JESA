import { NextResponse } from "next/server";
import { requestAdminAccess } from "@/app/admin/lib/server-auth";
import { logAdminAction } from "@/app/admin/lib/audit";
import { getAdminAuth } from "@/lib/firebase-admin";

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

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookieHeader(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await requestAdminAccess(token);

    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.email) {
        await logAdminAction("request_admin_access", {
          email: decoded.email,
          uid: decoded.uid,
        }, request, {
          details: { status: result.status },
        });
      }
    } catch {
      // ignore audit log errors
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin request access error:", error);
    return NextResponse.json(
      { error: "Failed to process admin access request" },
      { status: 500 }
    );
  }
}
