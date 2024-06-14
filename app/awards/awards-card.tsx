"use client";

import { LampContainer } from "@/components/animated/lamp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { zodiak } from "../fonts";
import BlurIn from "@/components/animated/blur-in";
import { awards } from "@/public/data/awards";
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
      <div className="py-16 md:py-28 lg:py-32 pt-[6rem] ">
        <div className="flex flex-col items-center gap-6 px-4 space-y-[6rem]">
          {awards.map((award, index) => (
            <Card
              className="bg-background border-primary max-w-7xl"
              key={index}
            >
              <div className="flex justify-center flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <Image
                    src={award.image}
                    alt={award.name}
                    width={130}
                    height={130}
                    className="h-fit"
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
                      Who Will be the Partners of JESA 2024?
                    </CardTitle>
                    <div className="flex justify-between">
                      <div className="flex flex-col items-center">
                        <span className="mb-[-5px] bg-gradient-to-t from-amber-500 to-amber-300 bg-clip-text text-transparent font-bold">
                          2024
                        </span>
                        <Image
                          src="/images/companies/silver-un.png"
                          alt={`Platinum Sponsor 2024? `}
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
                        <span className="mb-[-5px] bg-gradient-to-t from-zinc-500 to-zinc-300 bg-clip-text text-transparent font-bold">
                          2024
                        </span>
                        <Image
                          src="/images/companies/silver-un.png"
                          alt={`Platinum Sponsor 2024? `}
                          className="rounded-md shadow-lg z-10"
                          width={75}
                          height={75}
                          quality={100}
                        />
                        <span className="mt-[-8px] bg-gradient-to-t from-zinc-500 to-zinc-300 bg-clip-text text-transparent font-bold">
                          Platinum
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="mb-[-5px] bg-gradient-to-t from-zinc-300 to-zinc-100 bg-clip-text text-transparent font-bold">
                          2024
                        </span>
                        <Image
                          src="/images/companies/silver-un.png"
                          alt={`Platinum Sponsor 2024? `}
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
                    {/* {award.sponsors
                        .filter((sponsor) => sponsor.year === 2023)
                        .map((sponsor) => (
                          <Link href={sponsor.link} key={sponsor.year}>
                            <span className="flex justify-center mb-[-5px] z-50 bg-gradient-to-t from-zinc-500 to-zinc-300 bg-clip-text text-transparent font-bold">
                              {sponsor.year}
                            </span>
                            <Image
                              src={sponsor.imgSrc}
                              alt={`Platinum Sponsor ${sponsor.year}`}
                              className="rounded-md shadow-lg"
                              width={75}
                              height={75}
                              quality={100}
                            />
                          </Link>
                        ))} */}
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsPage;
