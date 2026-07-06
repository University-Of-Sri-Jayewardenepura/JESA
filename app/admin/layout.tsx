import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JESA 2026 | Admin Dashboard",
  description: "Admin dashboard for managing JESA 2026 applications.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
