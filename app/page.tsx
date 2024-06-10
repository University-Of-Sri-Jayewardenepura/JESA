import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Partners } from "@/components/partners";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 sm:w-full">
      <Hero />
      <Intro />
      <Partners />
    </main>
  );
}
