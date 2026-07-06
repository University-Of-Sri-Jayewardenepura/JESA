export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen bg-slate-950 text-slate-200"
      style={{ background: "var(--background-gradient)" }}
    >
      {children}
    </main>
  );
}
