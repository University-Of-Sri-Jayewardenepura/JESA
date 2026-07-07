import { NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/app/admin/lib/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getAdminDb();
    const appRef = db.collection("applications").doc(id);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const data = appDoc.data();
    const nic = data?.personalInfo?.nic;
    const whatsapp = data?.personalInfo?.whatsappNumber;
    const email = data?.academicInfo?.universityEmail;

    const batch = db.batch();
    batch.delete(appRef);
    if (nic)
      batch.delete(db.collection("unique_constraints").doc(`nic_${nic}`));
    if (whatsapp)
      batch.delete(
        db.collection("unique_constraints").doc(`wa_${whatsapp}`)
      );
    if (email)
      batch.delete(
        db.collection("unique_constraints").doc(`email_${email}`)
      );
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
