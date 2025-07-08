"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CtaButtonProps extends React.ComponentProps<typeof Button> {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function CtaButton({
  href,
  children,
  className,
  asChild = false,
  ...props
}: CtaButtonProps) {
  return (
    <div className="relative">
      <div className="group relative rounded-full p-1 transition-colors ">
        {/* Slate border - outside border around full button */}
        <div className="absolute -inset-px rounded-full bg-gradient-to-b from-slate-700 to-slate-900" />

        {/* Gold gradient background - between border and button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/30 via-background to-amber-200/30" />

        {/* Regular button in the middle */}
        <Button
          asChild={asChild || Boolean(href)}
          className={cn(
            "relative rounded-full z-10 bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all !font-semibold",
            className
          )}
          {...props}
        >
          {href ? <Link href={href}>{children}</Link> : children}
        </Button>
      </div>

      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -bottom-1 left-1/2 -z-20 h-[66px] w-[187px] -translate-x-1/2 bg-gradient-to-b from-transparent to-yellow-400/20 opacity-40 mix-blend-plus-lighter blur-3xl"
        aria-hidden="true"
      />
    </div>
  );
}
