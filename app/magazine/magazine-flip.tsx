"use client";

import React from "react";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import { TextAnimate } from "@/components/core/text-animate";

const pages = [
  { src: "/images/magazine/cover.png", alt: "JESA 2025 Magazine Cover - Featuring JESA Awards Logo" },
  { src: "/images/magazine/page1.png", alt: "JESA 2025 Past Winners and Achievements" },
  { src: "/images/magazine/page2.png", alt: "JESA 2025 Stories of Success and Partner Quotes" },
  { src: "/images/magazine/end.png", alt: "JESA 2025 Magazine Back Cover" },
];

export default function MagazineFlip() {
  return (
    <section className="relative px-safe pt-[140px] pb-[120px] md:pt-[148px] md:pb-[136px] lg:pt-[180px] lg:pb-[160px] xl:pb-[162px] min-h-screen flex flex-col items-center">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl mb-12">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] text-transparent leading-[1.125] tracking-tight md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          <span className="bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:text-transparent">
            Magazine
          </span>
        </h1>
        <div className="mt-5 max-w-[340px] text-center text-slate-500 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          <TextAnimate
            animation="blurInUp"
            by="word"
            delay={0.3}
            duration={0.5}
            once
            startOnView={false}
          >
            A digital magazine showcasing past JESA winners and their achievements
            and stories of their success including quotes from our partners and
            academic staff.
          </TextAnimate>
        </div>
      </div>

      <div className="flex justify-center items-center w-full relative z-10">
        <HTMLFlipBook
          width={400}
          height={550}
          maxShadowOpacity={0.5}
          drawShadow={true}
          showCover={true}
          size="fixed"
          className="shadow-2xl"
          startPage={0}
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          mobileScrollSupport={true}
          style={{}}
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className="bg-white rounded-r-md overflow-hidden shadow-lg relative"
            >
              <div className="relative w-full h-full">
                <Image
                  src={page.src}
                  alt={page.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div
        aria-hidden="true"
        className="-z-30 absolute inset-x-0 bottom-0 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-amber-100/20 opacity-30" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(251,191,36,0.12),transparent)]" />
      </div>
    </section>
  );
}