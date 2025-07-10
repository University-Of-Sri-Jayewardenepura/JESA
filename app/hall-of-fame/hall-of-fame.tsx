"use client";

import Image from "next/image";
import React from "react";
import { images } from "@/constants/hall-of-fame";
import { TextAnimate } from "@/components/core/text-animate";

const HallOfFamePage: React.FC = () => {
  return (
    <section className="relative pt-[140px] px-safe pb-[120px] md:pt-[148px] md:pb-[136px] lg:pt-[180px] lg:pb-[160px] xl:pb-[162px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] leading-[1.125] tracking-tight text-transparent md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          <span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:inline md:text-transparent">
            Hall of Fame
          </span>
        </h1>

        <div className="mt-5 max-w-[340px] text-center text-slate-500 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            startOnView={false}
            delay={0.3}
            duration={0.5}
          >
            The legacy of JESA is an enduring testament to the celebration of
            young talents and their exceptional achievements. Over the years,
            this prestigious platform has become synonymous with excellence and
            recognition.
          </TextAnimate>
        </div>
      </div>

      <div className="py-16 md:py-28 lg:py-32">
        <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-12 px-4 md:px-6">
          {images.map((image, index) => (
            <div key={index} className="pb-4 md:pb-12 lg:pb-24">
              <h1 className="relative z-20 bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 md:pb-6 lg:pb-8 text-center font-title text-[24px] leading-[1.125] tracking-tight text-transparent md:text-[40px] lg:text-[64px] xl:text-[72px]">
                <span className="bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:text-transparent">
                  {image.year}
                </span>
              </h1>
              <div className="border border-slate-800 shadow-2xl rounded-[10px]">
                <Image
                  key={image.year}
                  src={image.image}
                  width={1702}
                  height={368}
                  alt={image.year}
                  quality={100}
                  priority
                  className="w-[500px] sm:w-[720px] md:w-[960px] lg:w-[1280px] aspect-[1702/368] rounded-[10px]"
                />
              </div>
            </div>
          ))}
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

export default HallOfFamePage;
