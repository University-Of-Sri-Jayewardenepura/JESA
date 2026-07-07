import { NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/app/admin/lib/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = await getAdminDb()
      .collection("applications")
      .orderBy("submittedAt", "desc")
      .get();

    const applications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : null,
        submittedAt: data.submittedAt?._seconds
          ? new Date(data.submittedAt._seconds * 1000).toISOString()
          : null,
        updatedAt: data.updatedAt?._seconds
          ? new Date(data.updatedAt._seconds * 1000).toISOString()
          : null,
      };
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Admin applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
