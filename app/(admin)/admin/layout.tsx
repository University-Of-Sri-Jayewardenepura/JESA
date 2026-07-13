import { AuthProvider } from "@/app/admin/providers/auth-provider";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthProvider>{children}</AuthProvider>;
}
