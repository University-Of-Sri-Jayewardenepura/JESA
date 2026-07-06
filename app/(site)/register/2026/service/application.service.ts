import { applicationBusinessSchema } from "../schemas/applicationSchema";
import {
  runTransaction,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createNewApplication(
  formData: any
): Promise<string> {
  const result = applicationBusinessSchema.safeParse(formData);

  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(message);
  }

  const data = result.data;

  const appId = crypto.randomUUID();

  const nic = data.personalInfo.nic;
  const whatsapp = data.personalInfo.whatsappNumber;
  const email = data.academicInfo.universityEmail;

  const nicRef = doc(db, "unique_constraints", `nic_${nic}`);
  const waRef = doc(db, "unique_constraints", `wa_${whatsapp}`);
  const emailRef = doc(db, "unique_constraints", `email_${email}`);
  const appRef = doc(db, "applications", appId);

  try {
    const duplicateFields: string[] = [];

    await runTransaction(db, async (transaction) => {
      const nicSnap = await transaction.get(nicRef);
      const waSnap = await transaction.get(waRef);
      const emailSnap = await transaction.get(emailRef);

      if (nicSnap.exists()) duplicateFields.push("NIC");
      if (waSnap.exists()) duplicateFields.push("WhatsApp Number");
      if (emailSnap.exists()) duplicateFields.push("University Email");

      if (duplicateFields.length > 0) {
        throw new Error("DUPLICATE_FOUND");
      }

      transaction.set(appRef, {
        applicationId: appId,
        ...data,
        status: "submitted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });

      transaction.set(nicRef, { appId });
      transaction.set(waRef, { appId });
      transaction.set(emailRef, { appId });
    });

    return appId;
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_FOUND") {
      throw new Error(
        "You already submitted an application. Duplicate fields detected."
      );
    }

    throw error;
  }
}
