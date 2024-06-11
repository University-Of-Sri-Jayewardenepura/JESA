import { Metadata } from "next/types";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Official 2024 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32">
      <RegisterForm />
    </div>
  );
}
