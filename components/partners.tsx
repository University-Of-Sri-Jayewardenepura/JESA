import { cn } from "@/lib/utils";
import Marquee from "@/components/animated/marquee";
import Image from "next/image";
import Link from "next/link";
import { partners } from "@/constants/sponsors";

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
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-primary bg-background/80 hover:bg-emerald-950"
      )}
    >
      <Link href={link} className="flex flex-row items-center gap-2">
        <Image
          className="rounded-md"
          width="64"
          height="64"
          alt={partnership}
          src="/images/companies/question.png"
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
    <section className="flex flex-col max-w-7xl w-full">
      <h1 className="mb-[-.40rem] md:mb-[-.60rem] lg:mb-[-1.2rem] bg-gradient-to-br from-amber-300 to-amber-950 bg-clip-text text-center text-5xl md:text-7xl lg:text-9xl font-bold uppercase tracking-tight text-transparent">
        Sponsors
      </h1>
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background py-20 border border-primary/70 md:shadow-xl mb-[6rem]">
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-emerald-950/60"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-emerald-950/60"></div>
      </div>
    </section>
  );
};
