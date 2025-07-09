"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Announcement: React.FC = () => {
  return (
    <div
      className="fixed top-0 z-50 flex h-9 w-full items-center justify-center gap-x-4 overflow-hidden border-b border-gradient-to-r from-slate-700 via-slate-500 to-slate-700 lg:px-safe"
      style={{ background: "var(--gradient-annoucement)" }}
    >
      <div className="flex items-center gap-x-3.5">
        <p className=" text-sm leading-snug tracking-tighter  space-x-2">
          Announcing two new BESA awards &nbsp;
          <span className="opacity-30">|</span>
          &nbsp;
          <Link
            href="/awards"
            className="group hover:text-slate-300 transition-colors"
          >
            Learn more &nbsp;
            <ArrowRight className="inline h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-300" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Announcement;
