import { Loader2 } from "lucide-react";

export default function AdminLoadingPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading admin dashboard...</p>
      </div>
    </section>
  );
}
