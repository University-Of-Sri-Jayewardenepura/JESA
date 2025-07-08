"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CtaButtonProps extends React.ComponentProps<typeof Button> {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
}

export function CtaButton({
  href,
  children,
  className,
  variant = "default",
  asChild = false,
  ...props
}: CtaButtonProps) {
  const isDefault = variant === "default";

  return (
    <div className="relative w-full">
      <div className="group relative rounded-full p-1 transition-colors w-full">
        {/* Border around button */}
        <div className="absolute -inset-px rounded-full bg-gradient-to-b from-slate-00 to-slate-900" />

        {/* Gold gradient background - for both default and secondary variants */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-300/10 via-background to-slate-300/10" />

        {/* Regular button in the middle */}
        <Button
          asChild={asChild || Boolean(href)}
          variant={isDefault ? "default" : "ghost"}
          className={cn(
            "relative rounded-full z-10 w-full transition-all !font-semibold",
            isDefault ? "bg-white hover:bg-slate-100" : "",
            className
          )}
          {...props}
        >
          {href ? (
            <Link className="w-full block text-center" href={href}>
              {children}
            </Link>
          ) : (
            children
          )}
        </Button>
      </div>

      {/* Glow effect - only for default variant */}
      {isDefault && (
        <div
          className="pointer-events-none absolute -bottom-1 left-1/2 -z-20 h-[66px] w-[187px] -translate-x-1/2 bg-gradient-to-b from-transparent to-yellow-400/20 opacity-40 mix-blend-plus-lighter blur-3xl"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
