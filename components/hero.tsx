import React from "react";
import { CtaButton } from "@/components/ui/cta-button";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="hero relative px-safe pb-[120px] pt-[124px] md:pb-[136px] md:pt-[142px] lg:pb-[160px] lg:pt-[232px] xl:pb-[162px] xl:pt-[180px]">
      {/* Space for image above the title */}
      <div className="absolute inset-x-0 top-0 h-[200px] md:h-[250px] lg:h-[300px] xl:h-[320px]">
        {/* This is where your hero image would go */}
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 mt-[120px] max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] leading-[1.125] tracking-tight text-transparent md:mt-[140px] md:max-w-none md:text-[56px] lg:mt-[160px] lg:text-[64px] xl:mt-[180px] xl:text-[72px]">
          J'pura{" "}
          <span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:inline md:text-transparent">
            Employability
          </span>
          <br className="hidden md:block" /> Skills Awards
        </h1>

        <p className="mt-5 max-w-[262px] text-center text-slate-500 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          Bask in the spotlight of recognition at the most prestigious and
          elegant
          <br className="block md:hidden" /> award gala ever organized by the
          University of Sri Jayewardenepura.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <div className="w-5/7 sm:w-1/2">
            <CtaButton href="/register">Register Now</CtaButton>
          </div>

          <div className="w-5/7 sm:w-1/2">
            <CtaButton href="/about" variant="secondary">
              Learn More
            </CtaButton>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 -z-30 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-b from-transparent to-amber-100/20" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(251,191,36,0.12),transparent)]" />
      </div>
    </section>
  );
};

export default Hero;
