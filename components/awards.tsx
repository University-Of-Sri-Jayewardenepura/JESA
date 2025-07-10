"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { awards } from "@/constants/awards";

// Add isNew property to specific awards (you can modify this logic later)
const awardCategories = awards.map((award, index) => ({
  id: award.id,
  title: award.name,
  image: award.image,
  isNew: index === 7 || index === 15 || index === 16,
}));

export default function Awards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set window width on client-side only
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const visibleCount = getVisibleCount();
      const maxIdx = Math.max(0, awardCategories.length - visibleCount);
      if (prev === 0) return maxIdx;
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const visibleCount = getVisibleCount();
      const maxIdx = Math.max(0, awardCategories.length - visibleCount);
      if (prev >= maxIdx) return 0;
      return prev + 1;
    });
  };

  // Calculate how many items can be visible at once
  const getVisibleCount = () => {
    if (windowWidth >= 1024) return 3; // Desktop: show 3
    if (windowWidth >= 768) return 2; // Tablet: show 2
    return 1; // Mobile: show 1
  };

  // Adjust current index to prevent overscroll
  const maxIndex = Math.max(0, awardCategories.length - getVisibleCount());
  const adjustedIndex = Math.min(currentIndex, maxIndex);

  // Calculate item width including gap
  const getItemWidth = () => {
    if (windowWidth >= 1024) return 320 + 20; // lg:w-80 (320px) + gap
    return 264 + 16; // w-[264px] + gap
  };

  return (
    <section className="overflow-hidden pb-[76px] pt-[120px] px-safe md:pb-0 md:pt-[146px] lg:pt-44 xl:pt-[117px]">
      <div className="container mx-auto px-5 md:px-8">
        <h2 className="secondary-title">Award Categories</h2>
      </div>
      <div className="relative mx-auto mt-8 w-full lg:mt-9">
        <div className="relative z-10">
          <div className="overflow-hidden pl-5 md:pl-8">
            <div
              className="flex items-center justify-start gap-4 lg:gap-5 pr-5 md:pr-8 pb-4 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${adjustedIndex * getItemWidth()}px)`,
              }}
            >
              {awardCategories.map((category, index) => {
                return (
                  <div
                    key={index}
                    className="relative h-[348px] w-[264px] lg:h-[400px] lg:w-80 flex-shrink-0"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                      {/* Background gradient for awards */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />

                      {/* Award image centered */}
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <Image
                          src={category.image}
                          alt={category.title}
                          width={180}
                          height={180}
                          className="w-32 h-32 lg:w-40 lg:h-40 object-contain"
                          priority={index < 2}
                        />
                      </div>
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage: "url('/images/noise-pixel.png')",
                          backgroundRepeat: "repeat",
                          opacity: 0.2,
                          mixBlendMode: "overlay",
                        }}
                      ></div>
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: "var(--background-card)",
                          mixBlendMode: "overlay",
                          opacity: 0.6,
                        }}
                      ></div>
                      <h3 className="absolute left-5 top-5 max-w-44 text-[20px] font-medium leading-tight tracking-tightest lg:left-6 lg:top-6 lg:text-[24px]">
                        {category.title}
                      </h3>

                      {category.isNew && (
                        <span className="absolute right-5 top-[23px] flex h-5 items-center justify-center rounded bg-emerald-400/[0.5] px-3 text-[8px] font-semibold uppercase leading-none tracking-tighter text-gray-90 backdrop-blur-[2px] lg:right-6 lg:top-[29px]">
                          New
                        </span>
                      )}

                      <div
                        className="pointer-events-none absolute inset-0 rounded-[10px] border border-white opacity-60 mix-blend-overlay"
                        aria-hidden="true"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="relative pl-5 md:pl-8">
            <button
              onClick={handlePrev}
              className="group absolute -bottom-[68px] right-[76px] flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full md:right-[88px] md:top-[-80px] lg:top-[-84px] z-20"
              aria-label="Previous slide"
            >
              <ArrowLeft size={20} />
              <span className="sr-only">Previous slide</span>
            </button>

            <button
              onClick={handleNext}
              className="group absolute -bottom-[68px] right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full md:right-8 md:top-[-80px] lg:top-[-84px] z-20"
              aria-label="Next slide"
            >
              <ArrowRight size={20} />
              <span className="sr-only">Next slide</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
