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
import Image from "next/image";
import { imageSrcs } from "@/constants/gallery";

export function Gallery() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-6xl flex mx-auto relative gap-2 pt-[2rem]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imageSrcs.map((src, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center"
          >
            <div className="p-1">
              <Image
                src={src}
                alt="Gallery Image"
                width={1080}
                height={350}
                className="rounded-lg border border-primary/70"
                priority
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex" />
      <CarouselNext className="hidden lg:flex" />
    </Carousel>
  );
}
