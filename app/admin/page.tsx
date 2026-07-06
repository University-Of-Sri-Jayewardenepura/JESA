import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminDashboard from "./components/admin-dashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  return (
    <AdminDashboard
      userEmail={session.user.email}
      userName={session.user.name}
    />
  );
}
