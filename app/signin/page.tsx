"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Chrome, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "AccessDenied":
        return "This account is not authorized as an admin.";
      case "Configuration":
        return "Authentication is not configured correctly.";
      case "OAuthCallback":
        return "Google sign-in was cancelled or failed.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

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
            <p className="text-sm text-red-200">{getErrorMessage(error)}</p>
          </div>
        )}

        <Button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 md:p-10 backdrop-blur-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-slate-800 rounded-lg" />
              <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto" />
              <div className="h-12 bg-slate-800 rounded-lg" />
            </div>
          </div>
        </section>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
