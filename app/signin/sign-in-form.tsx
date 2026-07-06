"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Chrome, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/app/admin/providers/auth-provider";

export default function SignInForm() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again."
      );
    }
  };

  if (authLoading || checking || user) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 md:p-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text font-title text-[32px] text-transparent leading-[1.125] tracking-tight md:text-[40px]">
            Admin Access
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Sign in with your authorized Google account to manage applications.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSignIn}
          className="w-full rounded-[8px] py-3 font-medium text-base bg-white text-slate-950 hover:bg-slate-100"
        >
          <Chrome className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Only pre-authorized admin accounts can access this dashboard.
        </p>
      </div>
    </section>
  );
}
