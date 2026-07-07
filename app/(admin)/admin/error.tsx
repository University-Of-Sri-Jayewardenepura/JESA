"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin] Server error:", error);
  }, [error]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-slate-900/50 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-title text-2xl text-slate-100 mb-2">
          Admin Dashboard Error
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Something went wrong while loading the admin dashboard. This is usually caused by missing or invalid Firebase configuration.
        </p>
        {error.message && (
          <p className="text-red-300 text-xs mb-6 break-words bg-red-900/20 p-3 rounded-xl">
            {error.message}
          </p>
        )}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="rounded-[8px] bg-white text-slate-950 hover:bg-slate-100"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/signin")}
            variant="outline"
            className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
