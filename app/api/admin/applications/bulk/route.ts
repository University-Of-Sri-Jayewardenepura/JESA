import { NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/app/admin/lib/server-auth";
import { logAdminAction } from "@/app/admin/lib/audit";
import { checkRateLimit, rateLimitResponse } from "@/app/admin/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase-admin";

const VALID_STATUSES = ["submitted", "shortlisted", "approved", "rejected"];

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, {
      windowMs: 60_000,
      maxRequests: 30,
    });
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfter);
    }

    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids, action, status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    if (action === "delete") {
      const snapshot = await db
        .collection("applications")
        .where("__name__", "in", ids)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        batch.delete(doc.ref);

        const nic = data?.personalInfo?.nic;
        const whatsapp = data?.personalInfo?.whatsappNumber;
        const email = data?.academicInfo?.universityEmail;

        if (nic)
          batch.delete(db.collection("unique_constraints").doc(`nic_${nic}`));
        if (whatsapp)
          batch.delete(db.collection("unique_constraints").doc(`wa_${whatsapp}`));
        if (email)
          batch.delete(db.collection("unique_constraints").doc(`email_${email}`));
      });

      await batch.commit();

      await logAdminAction("bulk_delete_applications", user, request, {
        details: { count: snapshot.docs.length, ids },
      });

      return NextResponse.json({ success: true, deleted: snapshot.docs.length });
    }

    if (action === "status") {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const batch = db.batch();
      ids.forEach((id: string) => {
        const ref = db.collection("applications").doc(id);
        batch.update(ref, {
          status,
          updatedAt: new Date(),
          updatedBy: user.email,
        });
      });

      await batch.commit();

      await logAdminAction("bulk_status_update", user, request, {
        details: { status, count: ids.length, ids },
      });

      return NextResponse.json({ success: true, updated: ids.length, status });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[Admin API] Bulk operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
}
