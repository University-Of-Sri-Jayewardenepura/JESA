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

export function Gallery() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const imageSrcs = [
    "/images/carousel/image1.jpg",
    "/images/carousel/image2.jpg",
    "/images/carousel/image3.jpg",
    "/images/carousel/image4.jpg",
    "/images/carousel/image5.jpg",
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-6xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imageSrcs.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Image
                src={src}
                alt="Gallery Image"
                width={1080}
                height={350}
                className="rounded-lg border"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
