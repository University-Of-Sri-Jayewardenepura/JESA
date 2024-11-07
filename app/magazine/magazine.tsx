"use client";

import React from 'react';
import { LampContainer } from "@/components/animated/lamp";
import BlurIn from "@/components/animated/blur-in";
import { motion } from "framer-motion";
import { zodiak } from "../fonts";

const Magazine: React.FC = () => {
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
            Magazine
          </motion.h1>
        </LampContainer>
      </div>
      <div className="px-8 max-w-xl md:max-w-2xl lg:max-w-3xl text-white/75 z-20 ">
        <BlurIn
          word="Showcasing months of dedicated work culminating in the grand JESA Awards Ceremony. This magazine highlights the meticulous planning, the inspiring stories, and the unforgettable moments that made the event a resounding success. A tribute to the collective effort and passion that brought the JESA vision to life."
          className="text-center"
          duration={2}
        />
      </div>
      <div className="w-full max-w-4xl flex justify-center align-middle max-w-6x shadow-lg mt-8 pt-24 mb-24">
      <iframe
          src="/magazine.pdf#toolbar=0#view=fitH#zoom=100"
          className="w-full h-screen"
          title="JESA Magazine"
          style={{ height: "125vh", width: "95%" }}
        />
      </div>
    </section>
  );
};

export default Magazine;