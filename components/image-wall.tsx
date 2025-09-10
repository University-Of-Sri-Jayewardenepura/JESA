"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { imageSrcs } from "@/constants/gallery";

export default function ImageWall() {
  // Split images into two rows
  const firstRow = imageSrcs.slice(0, Math.ceil(imageSrcs.length / 2));
  const secondRow = imageSrcs.slice(Math.ceil(imageSrcs.length / 2));

  // Calculate the width of one set of images for seamless scrolling
  const imageWidth = 384; // w-96 = 384px
  const gap = 16; // gap-4 = 16px
  const firstRowWidth = firstRow.length * (imageWidth + gap);
  const secondRowWidth = secondRow.length * (imageWidth + gap);
  const mobileImageWidth = 384; // w-96 = 384px for mobile too
  const allImagesWidth = imageSrcs.length * (mobileImageWidth + gap);

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Desktop: Two rows */}
      <div className="hidden space-y-4 md:block">
        {/* First row - moving left */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: [-firstRowWidth, 0],
            }}
            className="flex gap-4"
            transition={{
              duration: 50,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...firstRow, ...firstRow, ...firstRow].map((src, index) => (
              <div
                className="h-64 w-96 flex-shrink-0 overflow-hidden rounded-[4px]"
                key={`row1-${index}`}
              >
                <Image
                  alt={`Gallery image ${index + 1}`}
                  className="h-full w-full rounded-[4px] object-cover transition-transform duration-300 hover:scale-105"
                  height={256}
                  src={src}
                  width={384}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row - moving right */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: [0, -secondRowWidth],
            }}
            className="flex gap-4"
            transition={{
              duration: 50,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...secondRow, ...secondRow, ...secondRow].map((src, index) => (
              <div
                className="h-64 w-96 flex-shrink-0 overflow-hidden rounded-[4px]"
                key={`row2-${index}`}
              >
                <Image
                  alt={`Gallery image ${index + 1}`}
                  className="h-full w-full rounded-[4px] object-cover transition-transform duration-300 hover:scale-105"
                  height={256}
                  src={src}
                  width={384}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile: Single row */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: [-allImagesWidth, 0],
            }}
            className="flex gap-4"
            transition={{
              duration: 100,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...imageSrcs, ...imageSrcs, ...imageSrcs].map((src, index) => (
              <div
                className="h-64 w-96 flex-shrink-0 overflow-hidden rounded-[4px]"
                key={`mobile-${index}`}
              >
                <Image
                  alt={`Gallery image ${index + 1}`}
                  className="h-full w-full rounded-[4px] object-cover"
                  height={256}
                  src={src}
                  width={384}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/7 bg-gradient-to-r from-background-dark via-background-dark/90 to-transparent md:w-1/5" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/7 bg-gradient-to-l from-background-dark via-background-dark/90 to-transparent md:w-1/5" />
    </div>
  );
}
