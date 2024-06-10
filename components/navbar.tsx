"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <Link href="/awards" className=" hidden md:block">
            Awards
          </Link>
          <Link href="/hall-of-fame" className="hidden md:block">
            Hall of Fame
          </Link>
          <Button asChild className="rounded-full">
            <Link href="/register">Register</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

function MobileNav() {}
