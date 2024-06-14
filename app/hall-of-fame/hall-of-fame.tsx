"use client";

import { LampContainer } from "@/components/animated/lamp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { images } from "@/constants/hall-of-fame";
import { zodiak } from "../fonts";
import BlurIn from "@/components/animated/blur-in";

const HallOfFamePage: React.FC = () => {
  return (
    <section className="flex flex-col items-center min-h-screen bg-gradient-to-b from-background to-background-gradient">
      <div className="w-full mb-[-13rem]">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
          >
            Hall of Fame
          </motion.h1>
        </LampContainer>
      </div>
      <div className="px-8 max-w-xl md:max-w-2xl lg:max-w-3xl text-white/75 z-20 ">
        <BlurIn
          word="The legacy of JESA is an enduring testament to the celebration of young
        talents and their exceptional achievements. Over the years, this
        prestigious platform has become synonymous with excellence and
        recognition, showcasing the remarkable skills and capabilities of
        undergraduates from the University of Sri Jayewardenepura and beyond."
          className="text-center"
          duration={2}
        />
      </div>
      <div className="py-16 md:py-28 lg:py-32">
        <div className="flex flex-col items-center gap-6 px-4">
          {images.map((image, index) => (
            <div key={index} className="pb-8 md:pb-16 lg:pb-32">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-amber-500 font-bold text-center pb-8">
                {image.year}
              </h1>
              <Image
                key={image.year}
                src={image.image}
                width={1200}
                height={627}
                alt={image.year}
                quality={100}
                className="w-[500px] sm:w-[720px] md:w-[960px] lg:w-[1280px] rounded-xl border border-primary/70 shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFamePage;
