import Awards from "@/components/awards";
import CTA from "@/components/cta";
import Hero from "@/components/hero";
import ImageWall from "@/components/image-wall";
import Sponsors from "@/components/sponsors";
import WhatIsJesa from "@/components/what-is";

export default function Home() {
  return (
    <>
      <Hero />
      <ImageWall />
      <WhatIsJesa />
      <Awards />
      {/* <Sponsors /> */}
      <CTA />
    </>
  );
}
