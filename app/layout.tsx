import type { Metadata } from "next";
import "./globals.css";
import { plusjakarta } from "./fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "JESA 2024 | J'pura Employability Skills Awards",
  description:
    "Official 2024 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusjakarta.className}`}>
        <Navbar />
        {children} <Footer />
      </body>
    </html>
  );
}
