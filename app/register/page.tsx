import { Metadata } from "next/types";
import RegisterForm from "./register-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Official 2024 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full">
        <h1> Jessa 24 Registration </h1>
        <h2 className=" text-slate-300"> Please select the category to proceed with the form </h2>
        <div className=" flex flex-col">
          <Button className="mt-4"> <Link rel="preload" href="/register/internal"> Students of University of Sri Jayewardenepura </Link></Button>
          <Button className="mt-4"> <Link rel="preload" href="/register/external"> Students of Other State Universities </Link></Button>
        </div>
    </div>
  );
}
