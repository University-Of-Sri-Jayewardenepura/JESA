"use client";

import { motion } from "motion/react";
import { imageSrcs } from "@/constants/gallery";
import Image from "next/image";

export default function ImageWall() {
  // Split images into two rows
  const firstRow = imageSrcs.slice(0, Math.ceil(imageSrcs.length / 2));
  const secondRow = imageSrcs.slice(Math.ceil(imageSrcs.length / 2));

  // Calculate the width of one set of images for seamless scrolling
  const imageWidth = 256; // w-64 = 256px
  const gap = 16; // gap-4 = 16px
  const firstRowWidth = firstRow.length * (imageWidth + gap);
  const secondRowWidth = secondRow.length * (imageWidth + gap);
  const mobileImageWidth = 192; // w-48 = 192px
  const allImagesWidth = imageSrcs.length * (mobileImageWidth + gap);

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Desktop: Two rows */}
      <div className="hidden md:block space-y-4">
        {/* First row - moving left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: [-firstRowWidth, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...firstRow, ...firstRow, ...firstRow].map((src, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={256}
                  height={160}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row - moving right */}
        <div className="relative overflow-hidden ">
          <motion.div
            className="flex gap-4"
            animate={{
              x: [0, -secondRowWidth],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...secondRow, ...secondRow, ...secondRow].map((src, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={256}
                  height={160}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[...imageSrcs, ...imageSrcs, ...imageSrcs].map((src, index) => (
              <div
                key={`mobile-${index}`}
                className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={192}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/90 to-transparent"></div>
    </div>
  );
}
