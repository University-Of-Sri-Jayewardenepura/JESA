"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <div className="flex min-h-screen place-content-center justify-center">
        <h2 className="text-white text-4xl">Something went wrong!</h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </html>
  );
}
