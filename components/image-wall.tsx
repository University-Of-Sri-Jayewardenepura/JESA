"use client";

import { motion } from "motion/react";
import { imageSrcs } from "@/constants/gallery";
import Image from "next/image";

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
      <div className="hidden md:block space-y-4">
        {/* First row - moving left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 "
            animate={{
              x: [-firstRowWidth, 0],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...firstRow, ...firstRow, ...firstRow].map((src, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 w-96 h-64 overflow-hidden rounded-[4px]"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={384}
                  height={256}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-[4px]"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row - moving right */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: [0, -secondRowWidth],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...secondRow, ...secondRow, ...secondRow].map((src, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 w-96 h-64 overflow-hidden rounded-[4px]"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={384}
                  height={256}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-[4px]"
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
            className="flex gap-4"
            animate={{
              x: [-allImagesWidth, 0],
            }}
            transition={{
              duration: 100,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...imageSrcs, ...imageSrcs, ...imageSrcs].map((src, index) => (
              <div
                key={`mobile-${index}`}
                className="flex-shrink-0 w-96 h-64 rounded-[4px] overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={384}
                  height={256}
                  className="w-full h-full object-cover rounded-[4px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/7 md:w-1/5 bg-gradient-to-r from-background-dark via-background-dark/90 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/7 md:w-1/5 bg-gradient-to-l from-background-dark via-background-dark/90 to-transparent"></div>
    </div>
  );
}
