"use client";

import { LampContainer } from "@/components/animated/lamp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { zodiak } from "../fonts";
import BlurIn from "@/components/animated/blur-in";

const awards = [
  {
    id: "0",
    uri: "best-leader",
    name: "Best Leader",
    image: "/images/awards/best-leader.png",
    description:
      "Special award is designed to encourage undergraduates to take on responsible leadership challenges involved in extracurricular activities and in academic-related activities. This award is given to one of the outstanding undergraduates - student leaders of the university",
    plat2019: "/images/companies/fonterra.png",
    plat2021: "/images/companies/brandix.png",
    plat2022: "/images/companies/brandix.png",
    plat2023: "/images/companies/alpha-apparels.png",
    gold2023: "/images/companies/csds.png",
    silv2023: "/images/companies/csds.png",
    plat2023link: "https://www.alpha.lk/",
    gold2023link: "http://careerskills.sjp.ac.lk/",
    silv2023link: "http://careerskills.sjp.ac.lk/",
  },
];

export const AwardsPage: React.FC = () => {
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
            className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-5xl md:text-7xl lg:text-9xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
          >
            Awards
          </motion.h1>
        </LampContainer>
      </div>
      <div className="px-8 max-w-xl md:max-w-2xl lg:max-w-3xl text-white/75 z-20 ">
        <BlurIn
          word="The JESA Awards highlight the remarkable talents and outstanding achievements of undergraduates from the University of Sri Jayewardenepura and beyond. This prestigious platform celebrates excellence across diverse fields, recognizing the dedication and exceptional skills of young minds."
          className="text-center"
          duration={2}
        />
      </div>
      <div className="py-16 md:py-28 lg:py-32">
        <div className="flex flex-col items-center gap-6 px-4">
          {awards.map((award) => (
            <div key={award.id} className="pb-32">
              <h1 className="text-3xl text-amber-500 font-bold text-center pb-8">
                {award.name}
              </h1>
              <Image
                key={award.id}
                src={award.image}
                width={100}
                height={75}
                alt={award.name}
                quality={100}
                className="rounded-xl border border-primary/50"
              />
              <p>{award.description}</p>
              <div>
                <h2>Platinum Sponsors:</h2>
                <Image
                  src={award.plat2019}
                  width={100}
                  height={100}
                  alt="Platinum Sponsor 2019"
                />
                <Image
                  src={award.plat2021}
                  width={100}
                  height={100}
                  alt="Platinum Sponsor 2021"
                />
                <Image
                  src={award.plat2022}
                  width={100}
                  height={100}
                  alt="Platinum Sponsor 2022"
                />
                <Image
                  src={award.plat2023}
                  width={100}
                  height={100}
                  alt="Platinum Sponsor 2023"
                />
              </div>
              <div>
                <h2>Gold Sponsor 2023:</h2>
                <Image
                  src={award.gold2023}
                  width={100}
                  height={100}
                  alt="Gold Sponsor 2023"
                />
              </div>
              <div>
                <h2>Silver Sponsor 2023:</h2>
                <Image
                  src={award.silv2023}
                  width={100}
                  height={100}
                  alt="Silver Sponsor 2023"
                />
              </div>
              <div>
                <h2>Links:</h2>
                <a href={award.plat2023link}>Platinum Sponsor 2023</a>
                <a href={award.gold2023link}>Gold Sponsor 2023</a>
                <a href={award.silv2023link}>Silver Sponsor 2023</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsPage;
