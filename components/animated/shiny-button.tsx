"use client";
import { type AnimationProps, motion } from "framer-motion";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

const ShinyButton = ({ text = "shiny-button" }) => {
  return (
    <motion.button
      {...animationProps}
      className="relative rounded-full px-6 py-2 md:px-8  font-medium  backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,#fbbf24_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_#fbbf24]"
    >
      <span
        className="relative block h-full w-full text-sm md:text-lg uppercase tracking-wide text-[rgba(251,191,36,.9)]"
        style={{
          maskImage:
            "linear-gradient(-75deg,#fbbf24 calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#fbbf24 calc(var(--x) + 100%))",
        }}
      >
        {text}
      </span>
      <span
        style={{
          mask: "linear-gradient(#fbbf24, #fbbf24) content-box,linear-gradient(#fbbf24, #fbbf24)",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,#fbbf24_calc(var(--x)+20%),#f59e0b_calc(var(--x)+25%),#fbbf24_calc(var(--x)+100%))] p-px"
      ></span>
    </motion.button>
  );
};

export default ShinyButton;
