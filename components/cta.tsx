"use client";

import React from "react";

import { CtaButton } from "@/components/ui/cta-button";

const CTA: React.FC = () => {
  return (
    <section className="cta relative px-safe pb-[120px] pt-[124px] md:pb-[136px] md:pt-[142px] lg:pb-[160px] lg:pt-[232px] xl:pb-[162px] xl:pt-[180px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h2 className="cta-title">
          Ready to Shine <br className="block lg:hidden" /> Among the Best?
        </h2>
        <p className="mt-5 max-w-[262px] text-center text-slate-500 tracking-tight md:max-w-none md:text-lg lg:mt-6 lg:text-xl">
          Be part of the legacy.
          <br className="block md:hidden" /> Register now and step into
          excellence.
        </p>
        <div className="relative flex justify-center">
          <div className="mt-5 w-fit md:mt-6 lg:mt-8">
            <CtaButton href="/">Registration Coming Soon</CtaButton>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 -z-30 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-0 opacity-30" />
        <div className="absolute inset-0 z-10" />
      </div>
    </section>
  );
};

export default CTA;
