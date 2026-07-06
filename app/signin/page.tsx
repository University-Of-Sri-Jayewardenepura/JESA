"use client";

import { AuthProvider } from "@/app/admin/providers/auth-provider";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignInForm />
    </AuthProvider>
  );
}
