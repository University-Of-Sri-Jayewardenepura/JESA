"use client";

import { LampContainer } from "@/components/animated/lamp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const images = [
  {
    year: "JESA'22",
    image: "/images/hall-of-fame/2022.png",
  },
  {
    year: "JESA'21",
    image: "/images/hall-of-fame/2021.jpg",
  },
  {
    year: "JESA'19",
    image: "/images/hall-of-fame/2020.jpg",
  },
  {
    year: "JESA'18",
    image: "",
  },
  {
    year: "JESA'17",
    image: "",
  },
  {
    year: "JESA'16",
    image: "",
  },
  {
    year: "JESA'15",
    image: "",
  },
];

const HallOfFame: React.FC = () => {
  return (
    <section className="flex flex-col items-center min-h-screen bg-background">
      <div className="w-full">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-amber-300 to-amber-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Hall of Fame
          </motion.h1>
        </LampContainer>
      </div>
      <div className="flex flex-col items-center gap-6">
        {images.map((image) => (
          <Image
            key={image.year}
            src={image.image}
            width={500}
            height={350}
            alt={image.year}
          />
        ))}
      </div>
    </section>
  );
};

export default HallOfFame;
