import CTA from "@/components/cta";
import ImageWall from "@/components/image-wall";
import Hero from "@/components/hero";
import Awards from "@/components/awards";
import WhatIsJesa from "@/components/what-is";

export default function Home() {
  return (
    <>
      <Hero />
      <ImageWall />
      <WhatIsJesa />
      <Awards />
      <CTA />
    </>
  );
}
