"use client";

import Image from "next/image";
import type React from "react";

const WhatIsJesa: React.FC = () => {
  const content = [
    {
      text: "JESA is ",
      highlights: ["the grandest celebration of excellence"],
      continuation: ", proudly hosted by the ",
      highlights2: ["Career Skills Development Society (CSDS)"],
      ending: " of the University of Sri Jayewardenepura.",
    },
    {
      text: "This iconic event honors ",
      highlights: ["exceptional undergraduates"],
      continuation: ", those who shine through ",
      highlights2: ["academic brilliance and extracurricular excellence"],
      ending: ".",
    },
    {
      text: "With ",
      highlights: ["seventeen prestigious titles"],
      continuation: ", JESA stands as a tribute to ",
      highlights2: ["resilience, leadership, and unwavering dedication"],
      ending: ", celebrating those who pursue growth, purpose, and excellence.",
    },
    {
      text: "Driven by the mission to ",
      highlights: ["empower future-ready graduates"],
      continuation: ", CSDS brings JESA to life, a platform where ",
      highlights2: ["potential meets recognition"],
      ending: ".",
    },
    {
      text: "More than just a ceremony, JESA uplifts and inspires, reminding undergraduates that true success stems from ",
      highlights: ["consistency, courage, and passion"],
      continuation: "",
      highlights2: [],
      ending: ".",
    },
  ];

  return (
    <section className="relative px-5 pt-[124px] sm:px-8 md:pt-[142px] md:pb-[136px] lg:px-[75px] lg:pt-[232px] lg:pb-[160px] xl:pt-[180px] xl:pb-[162px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:w-[890px]">
        <h2 className="cta-title">What is JESA?</h2>
        <div className="mt-8 space-y-8 text-center lg:mt-10 lg:space-y-10">
          {content.map((paragraph, index) => (
            <div key={index}>
              <p
                className={`-tracking-tightest text-center font-medium text-[20px] text-slate-400 leading-snug md:text-[28px] lg:text-[32px] [&_span]:font-title [&_span]:text-white ${
                  index === 2 || index === 3 ? "hidden md:block" : ""
                }`}
              >
                {paragraph.text}
                {paragraph.highlights.map((highlight, hIndex) => (
                  <span key={hIndex}>{highlight}</span>
                ))}
                {paragraph.continuation}
                {paragraph.highlights2.map((highlight, hIndex) => (
                  <span key={hIndex}>{highlight}</span>
                ))}
                {paragraph.ending}
              </p>
              {index === 1 && (
                <div className="mx-auto py-6 pt-12 w-full max-w-[1216px]">
                  <Image
                    alt="JESA Awards Ceremony"
                    className="h-auto w-full rounded-lg"
                    height={1080}
                    src="/images/jesa-awards.png"
                    width={1920}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsJesa;
