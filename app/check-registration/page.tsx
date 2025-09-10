import type { Metadata } from "next/types";
import CheckRegistrationForm from "./check-registration-form";

export const metadata: Metadata = {
  title: "JESA 2025 | Check Registration",
  description:
    "Enter your WhatsApp number and get registration details of your awards. This form allows you to check if you are registered for any awards by providing your WhatsApp number. It will retrieve the registration details associated with your number.",
};

export default function CheckRegistration() {
  return <CheckRegistrationForm />;
}
