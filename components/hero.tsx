"use client";

import Particles from "@/components/animated/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { zodiak } from "@/app/fonts";

export const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#fcd34d");

  useEffect(() => {
    setColor(theme === "dark" ? "#fcd34d" : "#fde68a");
  }, [theme]);

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-4">
      <span
        className={`pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-amber-400 to-amber-300/80 bg-clip-text text-center text-7xl  leading-none text-transparent md:text-9xl select-none flex font-black ${zodiak.className}`}
      >
        JESA
      </span>
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
