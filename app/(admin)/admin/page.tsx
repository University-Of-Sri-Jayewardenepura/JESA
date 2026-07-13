import { redirect } from "next/navigation";
import { getAdminUserFromCookies } from "@/app/admin/lib/server-auth";
import AdminDashboard from "./components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
	try {
		const user = await getAdminUserFromCookies();

		if (!user) {
			redirect("/signin");
		}

		return (
			<AdminDashboard
				userEmail={user.email}
				userName={user.name}
				isSuperAdmin={user.isSuperAdmin}
			/>
		);
	} catch (error) {
		console.error("[AdminPage] Failed to load admin dashboard:", error);
		throw error;
	}
}
