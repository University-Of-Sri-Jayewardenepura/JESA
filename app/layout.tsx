import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/core/facebook-pixel";
import MSClarity from "@/components/core/ms-clarity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JESA 2026 | J'pura Employability Skills Awards",
  description:
    "Official 2026 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://use.typekit.net/wnv5dxv.css" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <MSClarity />
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
