"use client";

import Particles from "@/components/animated/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import ShinyButton from "./animated/shiny-button";
import Link from "next/link";
import BlurIn from "./animated/blur-in";
import { Spotlight } from "@/components/animated/spotlight";

export const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#fcd34d");

  useEffect(() => {
    setColor(theme === "dark" ? "#fcd34d" : "#fde68a");
  }, [theme]);

  return (
    <div className="relative flex flex-col h-[650px] w-full items-center justify-center overflow-hidden bg-background pt-[6rem] space-y-6">
      <div className="flex flex-col items-center">
        <Image
          alt="JESA"
          width={400}
          height={200}
          src="/images/jesa-min.png"
          priority
        />
        <BlurIn
          className={`mx-auto max-w-[22rem] md:max-w-[40rem]  text-3xl font-semibold leading-tight md:text-5xl md:leading-[1.08] space-y-2 text-center mt-[-2.5rem]`}
          word="J'pura Employability Skills Awards"
          duration={1}
        />
      </div>
      <BlurIn
        className={`text-white/70 text-center max-w-2xl`}
        word="Your achievements deserve a grand celebration. Bask in the spotlight of
        recognition at the most prestigious and elegant award gala ever
        organized."
        duration={1.5}
        
      />
      {/* <BlurIn
        className="text-white/70"
        word="This is your moment to make history."
        duration={2.5}
      /> */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <Spotlight
        className="-top-40 left-0 md:left-80 md:-top-20 ml-[5rem] sm:ml-[10rem]"
        fill="white"
      />
      <ShinyButton text="Registrations Closed" />
      {/* <Link href="/register" className="hover:scale-110 mb-10">
        <ShinyButton text="Register" />
      </Link> */}
    </div>
  );
};
