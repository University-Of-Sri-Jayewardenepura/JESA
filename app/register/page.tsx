import { Metadata } from "next/types";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Register Now! This is your moment to make history. Your achievements deserve a grand celebration. Bask in the spotlight of recognition at the most prestigious and elegant award gala ever organized.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full">
      <RegisterForm />
    </div>
  );
}
