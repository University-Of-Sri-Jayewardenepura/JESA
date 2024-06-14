import { Metadata } from "next/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Register Now! This is your moment to make history. Your achievements deserve a grand celebration. Bask in the spotlight of recognition at the most prestigious and elegant award gala ever organized.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1 className=" sm:text-5xl text-4xl text-center pl-3 pr-3">JESA 2024 REGISTRATION</h1>
      <h2 className="text-slate-400 text-center pl-3 pr-3">
        Please select the category to proceed with the form
      </h2>
    
      <div className="flex flex-row justify-center items-center h-20 flex-wrap">
        <Link rel="preload" href="/register/internal">
          <Button className="m-4 px-6 py-2 shadow-md flex-1 h-24 w-64">
            Students of <br />
            University of Sri Jayewardenepura
          </Button>
        </Link>
        <Link rel="preload" href="/register/external">
          <Button className="m-4 px-6 py-2 shadow-md flex-1 h-24 w-64">
            Students of <br />
            Other State Universities
          </Button>
        </Link>
      </div>
    </div>
  );
}
