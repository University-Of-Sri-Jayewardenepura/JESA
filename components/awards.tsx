"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { awards } from "@/public/data/awards";
import Image from "next/image";
import { zodiak } from "@/app/fonts";

export function Awards() {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-6xl flex flex-col mx-auto relative gap-2 pt-[2rem] pb-[8rem] space-y-24"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <h1
        className={`text-3xl md:text-5xl lg:text-6xl text-primary text-center font-bold ${zodiak.className}`}
      >
        Awards
      </h1>
      <CarouselContent>
        {awards.map((award, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center"
          >
            <div className="p-1 flex flex-col items-center select-none">
              <Image
                width={100}
                height={100}
                src={award.image}
                alt={award.name}
                className="h-fit z-10 w-[100px] sm:w-[150px] md:w-[175px]"
              />
              <h1 className="text-3xl md:text-5xl lg:text-6xl mt-[-1.5rem] md:mt-[-2.5rem] pb-6 bg-gradient-to-t from-amber-300 to-amber-500 bg-clip-text text-transparent font-bold text-center">
                {award.name}
              </h1>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex" />
      <CarouselNext className="hidden lg:flex" />
    </Carousel>
  );
}
