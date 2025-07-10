"use client";

import React from "react";

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
    <section className="relative px-5 sm:px-8 lg:px-[75px] pt-[124px] md:pb-[136px] md:pt-[142px] lg:pb-[160px] lg:pt-[232px] xl:pb-[162px] xl:pt-[180px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:w-[890px]">
        <h2 className="cta-title">What is JESA?</h2>
        <div className="mt-8 lg:mt-10 text-center space-y-8 lg:space-y-10">
          {content.map((paragraph, index) => (
            <p
              key={index}
              className={`text-center text-[20px] font-medium leading-snug -tracking-tightest text-slate-400 md:text-[28px] lg:text-[32px] [&_span]:font-title [&_span]:text-white ${
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsJesa;
