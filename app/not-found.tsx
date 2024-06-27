"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col text-center space-y-4">
        <h1 className="bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-7xl font-bold">
          404
        </h1>
        <h2 className="text-white text-4xl">Page Not Found!</h2>
        <Link href="/">
          <Button asChild>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
