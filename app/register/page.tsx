import { Metadata } from "next/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Official 2024 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1 className=" text-4xl">JESA 2024 REGISTRATION</h1>
      <h2 className="text-slate-400">
        Please select the category to proceed with the form
      </h2>
    
      <div className="flex flex-row justify-center space-x-4 items-center h-20">
        <Link rel="preload" href="/register/internal">
          <Button className="mt-4 px-6 py-2 shadow-md flex-1 h-24 w-64">
            Students of <br />
            University of Sri Jayewardenepura
          </Button>
        </Link>
        <Link rel="preload" href="/register/external">
          <Button className="mt-4 px-6 py-2 shadow-md flex-1 h-24 w-64">
            Students of <br />
            Other State Universities
          </Button>
        </Link>
      </div>
    </div>
  );
}
