import { Metadata } from "next/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { zodiak } from "../fonts";

export const metadata: Metadata = {
  title: "JESA 2024 | Register",
  description:
    "Register Now! This is your moment to make history. Your achievements deserve a grand celebration. Bask in the spotlight of recognition at the most prestigious and elegant award gala ever organized.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1
        className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
      >
        JESA 2024 REGISTRATION
      </h1>
      <h2 className="text-sm md:text-lg text-white/75 text-center px-3">
        Please select the category to proceed with the form
      </h2>
      <div className="flex flex-row justify-center items-center flex-wrap pt-[2rem]">
        <Link rel="preload" href="/register/internal">
          <Button className="m-4 px-6 py-2 font-bold shadow-md flex-1 h-16 w-64">
            <span className="bg-gradient-to-b from-background to-emerald-950 bg-clip-text text-transparent">
              Students of <br />
              University of Sri Jayewardenepura
            </span>
          </Button>
        </Link>
        <Link rel="preload" href="/register/external">
          <Button className="m-4 px-6 py-2 font-bold shadow-md flex-1 h-16 w-64">
            <span className="bg-gradient-to-b from-background to-emerald-950 bg-clip-text text-transparent">
              Students of <br />
              Other State Universities
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
