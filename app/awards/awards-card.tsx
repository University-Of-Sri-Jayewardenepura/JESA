"use client";

import { LampContainer } from "@/components/animated/lamp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { zodiak } from "../fonts";
import BlurIn from "@/components/animated/blur-in";
import { awards } from "@/constants/awards";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
            className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
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
      {/* Award Cards */}
      <div className="py-16 md:py-28 lg:py-32 pt-[6rem]  ">
        <div className="flex flex-col items-center gap-6 px-4 space-y-[6rem]">
          {awards.map((award) => (
            <div key={award.id}>
              {award.id === "7" && (
                <div className="flex flex-col items-center justify-center pb-[6rem] max-w-7xl text-center">
                  <h2
                    className={`mt-8 bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-transparent  ${zodiak.className}`}
                  >
                    BEST EMPLOYABILITY SKILLS ACHIEVER (BESA)
                  </h2>
                  <p className="mt-[1rem] text-sm font-white/50 max-w-xl ">
                    Dedicated to the most optimistic and brilliant all-rounded
                    undergraduate from each faculty. (except for the faculty of
                    graduate studies) The winner is excelled in academics,
                    sports, and other extracurricular activities. Further, the
                    two contestants (2nd and 3rd place) with the next maximum
                    points in each faculty will be awarded as the BESA Silver
                    Medalists accordingly. BESA Awards will be granted under the
                    following faculties
                  </p>
                </div>
              )}
              <Card className=" bg-emerald-950/30 backdrop-blur-lg border-primary/50 max-w-7xl">
                <div className="flex justify-center flex-col md:flex-row">
                  <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Image
                      src={award.image}
                      alt={award.name}
                      width={130}
                      height={130}
                      className="h-fit"
                      priority
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <CardHeader>
                      <CardTitle className="pb-4 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">
                        {award.name}
                      </CardTitle>
                      <CardDescription>{award.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardTitle>Platinum Sponsors</CardTitle>
                      <div className="flex justify-between">
                        {award.sponsors
                          .filter((sponsor) => sponsor.type === "Platinum")
                          .map((sponsor) => (
                            <Link href={sponsor.link} key={sponsor.year}>
                              <span className="flex justify-center mb-[-5px] z-50 bg-gradient-to-t from-zinc-500 to-zinc-300 bg-clip-text text-transparent font-bold">
                                {sponsor.year}
                              </span>
                              <Image
                                src={sponsor.imgSrc}
                                alt={`Platinum Sponsor ${sponsor.year}`}
                                className="rounded-md shadow-lg w-[60px] md:w-[75px]"
                                width={75}
                                height={75}
                                quality={100}
                              />
                            </Link>
                          ))}
                      </div>
                      <CardTitle>
                        Sponsors of 2024
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center">
                          <span className="mb-[-5px] bg-gradient-to-t from-amber-500 to-amber-300 bg-clip-text text-transparent font-bold">
                            2024
                          </span>
                          <Image
                            src={award.sponsors[4].imgSrc}
                            alt={award.sponsors[4].imgSrc}
                            className="rounded-md shadow-lg z-10"
                            width={75}
                            height={75}
                            quality={100}
                          />
                          <span className="mt-[-8px] bg-gradient-to-t from-amber-500 to-amber-300 bg-clip-text text-transparent font-bold">
                            Gold
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="mb-[-5px] bg-gradient-to-t from-zinc-400 to-zinc-300 bg-clip-text text-transparent font-bold">
                            2024
                          </span>
                          <Image
                            src={award.sponsors[5].imgSrc}
                            alt={award.sponsors[5].imgSrc}
                            className="rounded-md shadow-lg z-10"
                            width={90}
                            height={90}
                            quality={100}
                          />
                          <span className="mt-[-8px] bg-gradient-to-t from-zinc-400 to-zinc-300 bg-clip-text text-transparent font-bold">
                            Platinum
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="mb-[-5px] bg-gradient-to-t from-zinc-300 to-zinc-100 bg-clip-text text-transparent font-bold">
                            2024
                          </span>
                          <Image
                            src={award.sponsors[6].imgSrc}
                            alt={award.sponsors[6].imgSrc}
                            className="rounded-md shadow-lg z-10"
                            width={75}
                            height={75}
                            quality={100}
                          />
                          <span className="mt-[-8px] bg-gradient-to-t from-zinc-300 to-zinc-100 bg-clip-text text-transparent font-bold">
                            Silver
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsPage;
