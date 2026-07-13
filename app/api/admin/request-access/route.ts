import { NextResponse } from "next/server";
import { logAdminAction } from "@/app/admin/lib/audit";
import { checkRateLimit, rateLimitResponse } from "@/app/admin/lib/rate-limit";
import { requestAdminAccess } from "@/app/admin/lib/server-auth";
import { getAdminAuth } from "@/lib/firebase-admin";

function getTokenFromCookieHeader(
	cookieHeader: string | null,
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
		const rateLimit = checkRateLimit(request, {
			windowMs: 60_000,
			maxRequests: 10,
		});
		if (!rateLimit.allowed) {
			return rateLimitResponse(rateLimit.retryAfter);
		}

		const cookieHeader = request.headers.get("cookie");
		const token = getTokenFromCookieHeader(cookieHeader);

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await requestAdminAccess(token);

		try {
			const decoded = await getAdminAuth().verifyIdToken(token);
			if (decoded.email) {
				await logAdminAction(
					"request_admin_access",
					{
						email: decoded.email,
						uid: decoded.uid,
					},
					request,
					{
						details: { status: result.status },
					},
				);
			}
		} catch {
			// ignore audit log errors
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("[Admin API] Request access error:", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to process admin access request";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
