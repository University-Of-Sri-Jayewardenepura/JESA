"use client";

import Particles from "@/components/animated/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { zodiak } from "@/app/fonts";
import { Button } from "./ui/button";
import Link from "next/link";

export const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#fcd34d");

  useEffect(() => {
    setColor(theme === "dark" ? "#fcd34d" : "#fde68a");
  }, [theme]);

  return (
    <div className="relative flex flex-col h-[600px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-4 pt-[6rem]">
      <h1
        className={`pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-center text-7xl  leading-none text-transparent md:text-9xl select-none flex font-black ${zodiak.className}`}
      >
        JESA
      </h1>
      <p className={`text-white/70 text-center max-w-2xl`}>
        Your achievements deserve a grand celebration. Bask in the spotlight of
        recognition at the most prestigious and elegant award gala ever
        organized.
        <br />
        <br />
        <span className="text-white">This is your moment to make history.</span>
      </p>
      <Button
        asChild
        className="font-bold text-lg text-background shadow-inner shadow-amber-400 rounded-full mt-8"
        size={"lg"}
      >
        <Link href="/register">Register</Link>
      </Button>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
};
