import { Metadata } from "next/types";
import { zodiak } from "../fonts";
import CheckRegistrationForm from "./check-registration-form";

export const metadata: Metadata = {
    title: "JESA 2024 | Check Registration",
    description:
        "Enter your WhatsApp number and get registration details of your awards. This form allows you to check if you are registered for any awards by providing your WhatsApp number. It will retrieve the registration details associated with your number.",
};

export default function Register() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 space-y-3">
        <h1
        className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-center text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight   ${zodiak.className}`}
      >
        Check <br /> Registration
      </h1>
      <h2 className="text-sm md:text-lg text-white/75 text-center px-3">
        Please enter your WhatsApp number to check your registration details.
      </h2> 
      <div className="flex flex-col justify-center items-center pt-[2rem] space-y-8 w-[18rem] md:w-[28rem]">
        <CheckRegistrationForm />
      </div>
    </div>
  );
}