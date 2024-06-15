"use client";
import { zodiak } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const SuccessPage = () => {
  useEffect(() => {
    toast.success("Registration Successful!");
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1
        className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
      >
        JESA 2024 REGISTRATION
      </h1>
      <h2 className="text-slate-300 text-2xl text-center pl-3 pr-3">
        Your registration form was received. Thank you!
      </h2>
      <div className="flex flex-col">
        <Button className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export default SuccessPage;
