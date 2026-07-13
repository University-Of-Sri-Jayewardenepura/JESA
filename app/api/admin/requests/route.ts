import { NextResponse } from "next/server";
import { logAdminAction } from "@/app/admin/lib/audit";
import { listAdminRequests } from "@/app/admin/lib/server-auth";
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

export async function GET(request: Request) {
	try {
		const cookieHeader = request.headers.get("cookie");
		const token = getTokenFromCookieHeader(cookieHeader);

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const requests = await listAdminRequests(token);

		try {
			const decoded = await getAdminAuth().verifyIdToken(token);
			if (decoded.email) {
				await logAdminAction(
					"view_applications",
					{ email: decoded.email, uid: decoded.uid },
					request,
					{
						details: { action: "list_admin_requests", count: requests.length },
					},
				);
			}
		} catch {
			// ignore audit log errors
		}

		return NextResponse.json({ requests });
	} catch (error) {
		console.error("Admin list requests error:", error);
		return NextResponse.json(
			{ error: "Failed to list admin requests" },
			{ status: 500 },
		);
	}
}
