import { NextResponse } from "next/server";
import { requestAdminAccess } from "@/app/admin/lib/server-auth";

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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin request access error:", error);
    return NextResponse.json(
      { error: "Failed to process admin access request" },
      { status: 500 }
    );
  }
}
