import { NextResponse } from "next/server";
import { listAdminRequests } from "@/app/admin/lib/server-auth";

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

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookieHeader(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await listAdminRequests(token);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Admin list requests error:", error);
    return NextResponse.json(
      { error: "Failed to list admin requests" },
      { status: 500 }
    );
  }
}
