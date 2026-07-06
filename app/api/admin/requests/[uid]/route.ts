import { NextResponse } from "next/server";
import { updateAdminStatus } from "@/app/admin/lib/server-auth";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookieHeader(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uid } = await params;
    const body = await request.json();
    const { status, revoke } = body;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateAdminStatus(token, uid, status, { revoke });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update status error:", error);
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    );
  }
}
