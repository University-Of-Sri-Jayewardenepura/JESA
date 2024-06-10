import { cn } from "@/lib/utils";
import Marquee from "@/components/animated/marquee";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    partnership: "Gift Partner",
    image: "/images/companies/nestle.png",
    link: "https://www.nestle.lk/",
    description: "Providing gifts for the event",
  },
  {
    partnership: "Broadcasting Partner",
    image: "/images/companies/japura-voice.png",
    link: "https://jpuravoice.lk/",
    description: "Handling event broadcasting",
  },
  {
    partnership: "Decoration Partner",
    image: "/images/companies/silver-un.png",
    link: "",
    description: "Responsible for event decoration",
  },
  {
    partnership: "Printing Partner",
    image: "/images/companies/wristband.png",
    link: "https://wristbandlanka.lk/",
    description: "Providing printing services",
  },
  {
    partnership: "Media Partner",
    image: "/images/companies/flames.png",
    link: "https://www.facebook.com/Jpuraflames",
    description: "Handling media coverage",
  },
  {
    partnership: "Photography Partner",
    image: "/images/companies/behance.png",
    link: "https://www.facebook.com/Behance.lk",
    description: "Providing photography services",
  },
  {
    partnership: "Live Streaming Partner",
    image: "/images/companies/silver-un.png",
    link: "",
    description: "Handling live streaming of the event",
  },
  {
    partnership: "Clothing Partner",
    image: "/images/companies/rogo.png",
    link: "https://rogotshirts.business.site/?utm_source=gmb&utm_medium=referral",
    description: "Providing clothing for the event",
  },
  {
    partnership: "Beauty Care Partner",
    image: "/images/companies/saloon-looks.png",
    link: "https://www.salonlooks.lk/",
    description: "Providing beauty care services",
  },
  {
    partnership: "Event T-Shirt Partner",
    image: "/images/companies/star.png",
    link: "https://www.star.lk/",
    description: "Providing event t-shirts",
  },
];

const firstRow = partners.slice(0, partners.length / 2);
const secondRow = partners.slice(partners.length / 2);

const ReviewCard = ({
  image,
  partnership,
  description,
  link,
}: {
  image: string;
  partnership: string;
  description: string;
  link: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <Link href={link} className="flex flex-row items-center gap-2">
        <Image
          className="rounded-md"
          width="64"
          height="64"
          alt={partnership}
          src={image}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {partnership}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">
            {description}
          </p>
        </div>
      </Link>
    </figure>
  );
};

export const Partners = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background py-20 md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:40s]">
        {firstRow.map((partners) => (
          <ReviewCard key={partners.partnership} {...partners} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((partners) => (
          <ReviewCard key={partners.partnership} {...partners} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};
