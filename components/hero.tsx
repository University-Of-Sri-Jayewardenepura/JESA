"use client";

import Particles from "@/components/animated/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#22c55e");

  useEffect(() => {
    setColor(theme === "dark" ? "#22c55e" : "#15803d");
  }, [theme]);

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-4">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-amber-300 to-amber-200/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent md:text-9xl select-none flex">
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
