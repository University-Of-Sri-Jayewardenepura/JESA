"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../lib/tailwind-utils.css";

const categories = [
  {
    title: "Marketing Agencies",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperformace-marketers.deff9d47.jpg&w=3840&q=100",
    comingSoon: false,
  },
  {
    title: "Wholesalers",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwholesalers.ac9c6289.jpg&w=3840&q=100",
    comingSoon: false,
  },
  {
    title: "E-commerce",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fe-commerce.873fb521.jpg&w=3840&q=100",
    comingSoon: false,
  },
  {
    title: "Online Travel Agencies",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftravel-agencies.4b4819f0.jpg&w=3840&q=100",
    comingSoon: false,
  },
  {
    title: "Affiliates",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faffiliates.92e5bfd5.jpg&w=3840&q=100",
    comingSoon: false,
  },
  {
    title: "Home Services",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome-services.9215f1a9.jpg&w=3840&q=100",
    comingSoon: true,
  },
  {
    title: "Web3",
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fweb3.77c90334.jpg&w=3840&q=100",
    comingSoon: true,
  },
];

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
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="mt-[355px] overflow-hidden pb-[76px] pt-[120px] px-safe md:mt-0 md:pb-0 md:pt-[146px] lg:pt-44 xl:pt-[117px]">
      <div className="container mx-auto px-5 md:px-8">
        <h2 className="secondary-title">Award Categories</h2>
      </div>
      <div className="relative mx-auto mt-8 w-full lg:mt-9">
        <div className="container mx-auto pl-5 md:pl-8 relative">
          <div className="overflow-x-scroll scrollbar-hide snap-x snap-mandatory">
            <ul className="flex items-center justify-start gap-4 lg:gap-5 pr-5 md:pr-8 pb-4 after:inline-block after:flex-shrink-0 after:w-0 lg:after:w-[192px]">
              {categories.map((category, index) => {
                // For mobile show only the current index, for tablet show 2 items, for desktop show 3
                const isVisible =
                  index === currentIndex || // Always show current index
                  (windowWidth >= 768 &&
                    index === (currentIndex + 1) % categories.length) || // Show next on tablet+
                  (windowWidth >= 1024 &&
                    index === (currentIndex + 2) % categories.length); // Show next+1 on desktop

                return (
                  <li
                    key={index}
                    className={`relative h-[348px] w-[264px] lg:h-auto lg:w-80 snap-center flex-shrink-0 ${
                      !isVisible ? "hidden md:block" : ""
                    }`}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={320}
                        height={400}
                        className="h-full w-full rounded-[10px] object-cover"
                        priority={index < 2}
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage: "url('/images/noise-pixel.png')",
                          backgroundRepeat: "repeat",
                          opacity: 0.1,
                          mixBlendMode: "overlay",
                        }}
                      ></div>
                      <h3 className="absolute left-5 top-5 max-w-44 text-20 font-medium leading-tight -tracking-tightest lg:left-6 lg:top-6 lg:text-24">
                        {category.title}
                      </h3>

                      {category.comingSoon && (
                        <span className="absolute right-5 top-[23px] flex h-5 items-center justify-center rounded bg-white/[0.12] px-3 text-8 font-semibold uppercase leading-none tracking-tighter text-gray-90 backdrop-blur-[2px] lg:right-6 lg:top-[29px]">
                          Coming soon
                        </span>
                      )}

                      <div
                        className="pointer-events-none absolute inset-0 rounded-[10px] border border-white opacity-60 mix-blend-overlay"
                        aria-hidden="true"
                      ></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="group absolute -bottom-[68px] right-[76px] flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full disabled:bg-gray-8 md:right-[88px] md:top-[-80px] lg:top-[-84px] xl:right-[calc((100vw-1152px)/2+56px)]"
            aria-label="Previous slide"
          >
            <ArrowLeft size={20} />
            <span className="sr-only">Previous slide</span>
          </button>

          <button
            onClick={handleNext}
            className="group absolute -bottom-[68px] right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full disabled:bg-gray-8 md:right-8 md:top-[-80px] lg:top-[-84px] xl:right-[calc((100vw-1152px)/2)]"
            aria-label="Next slide"
          >
            <ArrowRight size={20} />
            <span className="sr-only">Next slide</span>
          </button>
        </div>

        {/* Using external CSS for scrollbar hiding */}
      </div>
    </section>
  );
}
