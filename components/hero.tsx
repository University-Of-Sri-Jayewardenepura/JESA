"use client";

import Particles from "@/components/animated/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import ShinyButton from "./animated/shiny-button";
import Link from "next/link";

export const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#fcd34d");

  useEffect(() => {
    setColor(theme === "dark" ? "#fcd34d" : "#fde68a");
  }, [theme]);

  return (
    <div className="relative flex flex-col h-[600px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-4 pt-[6rem] space-y-6">
      <div className="flex flex-col items-center">
        <Image alt="JESA" width={400} height={200} src="/images/jesa-min.png" />
        <h3
          className={`pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-neutral-100 to-neutral-200 bg-clip-text text-center text-3xl  leading-none text-transparent md:text-5xl flex font-black mt-[-4rem] pb-2`}
        >
          J&apos;pura Employability Skills Awards
        </h3>
      </div>
      <p className={`text-white/70 text-center max-w-2xl`}>
        Your achievements deserve a grand celebration. Bask in the spotlight of
        recognition at the most prestigious and elegant award gala ever
        organized.
        <br />
        <br />
        <span className="text-white">This is your moment to make history.</span>
      </p>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <Link href="/register" className="hover:scale-110">
        <ShinyButton text="Register" />
      </Link>
    </div>
  );
};
