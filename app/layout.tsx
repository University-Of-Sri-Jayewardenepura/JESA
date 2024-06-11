import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Navbar } from "@/components/navbar";

const plusjakarta = localFont({
  src: [
    {
      path: "../public/fonts/PlusJakartaSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/PlusJakartaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PlusJakartaSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

const zodiak = localFont({
  src: [
    {
      path: "../public/fonts/Zodiak-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Zodiak-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "JESA 2024",
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
      <body className={plusjakarta.className}>
        <Navbar />
        {children}{" "}
      </body>
    </html>
  );
}
