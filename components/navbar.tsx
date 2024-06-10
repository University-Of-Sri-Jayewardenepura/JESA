import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 border rounded-full",
        className
      )}
    >
      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-black border border-black/[0.1] dark:border-white/[0.1] rounded-full shadow-lg">
        <a className="flex items-center space-x-4" href="/">
          <Image
            src="/images/jesa-icon.ico"
            width={24}
            height={24}
            alt="JESA 2024"
            className="h-8 w-8"
          />
          <h1 className="text-lg font-semibold hidden md:block">JESA 2024</h1>
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="/awards"
            className="text-black dark:text-white hidden md:block"
          >
            Awards
          </a>
          <a
            href="/hall-of-fame"
            className="text-black dark:text-white hidden md:block"
          >
            Hall of Fame
          </a>
          <a href="/register" className="text-black dark:text-white">
            Register
          </a>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
