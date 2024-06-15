"use client";
import { zodiak } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const SuccessPage = () => {
  const { toast } = useToast();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  useEffect(() => {
    toast({
      variant: "success",
      title: "Registration form received!",
      description: formattedDate,
      action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
    });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1
        className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
      >
        JESA 2024 REGISTRATION <br />
        <span className="bg-gradient-to-br from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
          Succesful
        </span>
      </h1>
      <h2 className="text-sm md:text-lg text-center px-3 text-emerald-400">
        Your registration form was received. <br />
        Thank you!
      </h2>
      <div className="flex flex-col">
        <Button className="mt-4 font-bold">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
