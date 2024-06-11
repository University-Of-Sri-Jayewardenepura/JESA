import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Partners } from "@/components/partners";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 sm:w-full bg-gradient-to-b from-background to-emerald-950">
      <Hero />
      <Gallery />
      <Intro />
      <Partners />
    </main>
  );
}
