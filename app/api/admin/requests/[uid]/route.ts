import { NextResponse } from "next/server";
import { logAdminAction } from "@/app/admin/lib/audit";
import { updateAdminStatus } from "@/app/admin/lib/server-auth";
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

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ uid: string }> },
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

		try {
			const decoded = await getAdminAuth().verifyIdToken(token);
			if (decoded.email) {
				const action = revoke
					? "revoke_admin"
					: status === "approved"
						? "approve_admin"
						: "reject_admin";
				await logAdminAction(
					action,
					{ email: decoded.email, uid: decoded.uid },
					request,
					{
						targetId: uid,
						details: { status, revoke },
					},
				);
			}
		} catch {
			// ignore audit log errors
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin update status error:", error);
		return NextResponse.json(
			{ error: "Failed to update admin status" },
			{ status: 500 },
		);
	}
}
