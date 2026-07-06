import { redirect } from "next/navigation";
import { getAdminUserFromCookies } from "./lib/server-auth";
import AdminDashboard from "./components/admin-dashboard";

export default async function AdminPage() {
  const user = await getAdminUserFromCookies();

  if (!user) {
    redirect("/signin");
  }

  return (
    <AdminDashboard userEmail={user.email} userName={user.name} />
  );
}
