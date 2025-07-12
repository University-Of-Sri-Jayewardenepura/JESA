"use client";
import { CtaButton } from "@/components/ui/cta-button";
import { useEffect } from "react";

const SuccessPage = () => {
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
    // Toast functionality can be added later when toast components are available
    console.log("Registration form received!", formattedDate);
  }, [formattedDate]);

  return (
    <section className="success relative px-safe pb-[120px] pt-[124px] md:pb-[136px] md:pt-[142px] lg:pb-[160px] lg:pt-[232px] xl:pb-[162px] xl:pt-[180px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] leading-[1.125] tracking-tight text-transparent md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          JESA 2025{" "}
          <span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:inline md:text-transparent">
            Registration
          </span>
          <br className="hidden md:block" /> Successful
        </h1>

        <p className="mt-5 max-w-[312px] text-center text-emerald-400 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          Your registration form was received.
          <br className="block md:hidden" /> Thank you!
        </p>

        <div className="mt-8 flex justify-center w-full max-w-md">
          <div className="w-5/7 sm:w-1/2">
            <CtaButton href="/">Back to Home</CtaButton>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 -z-30 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-b from-transparent to-emerald-100/20" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent)]" />
      </div>
    </section>
  );
};

export default SuccessPage;
