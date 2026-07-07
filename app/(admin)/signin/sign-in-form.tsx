"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Chrome, AlertCircle, Loader2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthClient } from "@/lib/firebase";
import { useAuth } from "@/app/admin/providers/auth-provider";

type AccessState = "checking" | "approved" | "pending" | "rejected" | "error";

export default function SignInForm() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const auth = getAuthClient();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAccessState("checking");
        return;
      }

      try {
        const res = await fetch("/api/admin/request-access", {
          method: "POST",
        });

        if (!res.ok) {
          throw new Error("Failed to verify admin access");
        }

        const data = await res.json();

        if (data.status === "approved") {
          setAccessState("approved");
          router.replace("/admin");
        } else if (data.status === "pending") {
          setAccessState("pending");
        } else if (data.status === "rejected") {
          setAccessState("rejected");
        } else {
          setAccessState("pending");
        }
      } catch (err) {
        setAccessState("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Access check failed"
        );
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setAccessState("checking");
    setErrorMessage("");
    try {
      await signInWithGoogle();
      // onAuthStateChanged will pick up the new user and call /api/admin/request-access
    } catch (err) {
      setAccessState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again."
      );
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAccessState("checking");
  };

  if (authLoading || (user && accessState === "checking")) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Verifying admin access...</p>
        </div>
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
            Sign in with your Google account to request access to the admin dashboard.
          </p>
        </div>

        {accessState === "pending" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-900/30 border border-amber-500/40 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200 font-medium">Access request pending</p>
              <p className="text-xs text-amber-300/80 mt-1">
                A super admin needs to approve your request before you can access the dashboard.
              </p>
            </div>
          </div>
        )}

        {accessState === "rejected" && (
          <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-200 font-medium">Access denied</p>
              <p className="text-xs text-red-300/80 mt-1">
                Your request was rejected. Contact the super admin if you think this is a mistake.
              </p>
            </div>
          </div>
        )}

        {accessState === "error" && (
          <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{errorMessage}</p>
          </div>
        )}

        {user ? (
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full rounded-[8px] py-3 font-medium text-base border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={handleSignIn}
            className="w-full rounded-[8px] py-3 font-medium text-base bg-white text-slate-950 hover:bg-slate-100"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Only approved admin accounts can access this dashboard.
        </p>
      </div>
    </section>
  );
}
