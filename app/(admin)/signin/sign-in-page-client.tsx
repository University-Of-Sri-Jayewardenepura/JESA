"use client";

import { AuthProvider } from "@/app/admin/providers/auth-provider";
import SignInForm from "./sign-in-form";

export default function SignInPageClient() {
	return (
		<AuthProvider>
			<SignInForm />
		</AuthProvider>
	);
}
