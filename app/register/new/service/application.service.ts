import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CreateApplicationData {
  [key: string]: any;
}

export async function createNewApplication(
  formData: CreateApplicationData
): Promise<string> {
  try {
    // Validate data
    // const validatedData = applicationSchema.parse(formData);

    const appId = crypto.randomUUID();

    await setDoc(doc(db, "applications", appId), {
      applicationId: appId,
      ...formData,
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp(),
    });

    return appId;
  } catch (error) {
    console.error("Error creating application:", error);

    throw new Error("Failed to create application. Please try again.");
  }
}