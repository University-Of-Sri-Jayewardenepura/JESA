import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Announcement from "@/components/annoucement";
import FacebookPixel from "@/components/core/facebook-pixel";
import MSClarity from "@/components/core/ms-clarity";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JESA 2025 | J'pura Employability Skills Awards",
  description:
    "Official 2025 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
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
        <div>
          <main
            className="flex min-w-[340px] flex-col overflow-hidden font-sans text-slate-200 antialiased"
            style={{ background: "var(--background-gradient)" }}
          >
            <header className="fixed top-9 right-0 left-0 z-50 flex justify-center bg-background px-5 px-safe pt-safe lg:h-16">
              <Announcement />
              <Nav />
            </header>
            <div className="min-h-screen">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
