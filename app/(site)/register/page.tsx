import type { Metadata } from "next/types";
// import { CtaButton } from "@/components/ui/cta-button";

export const metadata: Metadata = {
  title: "JESA 2026 | Register",
  description:
    "Register Now! This is your moment to make history. Your achievements deserve a grand celebration. Bask in the spotlight of recognition at the most prestigious and elegant award gala ever organized.",
};

export default function Register() {
  return (
    <section className="register relative px-safe pt-[124px] pb-[120px] md:pt-[142px] md:pb-[136px] lg:pt-[232px] lg:pb-[160px] xl:pt-[180px] xl:pb-[162px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] text-transparent leading-[1.125] tracking-tight md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          JESA 2026 <br />
          <span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-rose-200 md:inline md:text-transparent">
            Registrations are now closed!
          </span>
        </h1>

        {/* <p className="mt-5 max-w-[312px] text-center text-slate-500 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          Please select the category to proceed with the form
        </p> */}

        {/* <div className="mt-8 flex flex-col items-center justify-center gap-8 w-full max-w-md">
          <div className="w-full text-center">
            <h2 className="bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text font-title text-2xl leading-[1.125] tracking-tight text-transparent pb-6">
              Students of University of Sri Jayewardenepura
            </h2>
            <CtaButton href="/register/internal">Register Now</CtaButton>
          </div>

          <div className="w-full text-center">
            <h2 className="bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text font-title text-2xl leading-[1.125] tracking-tight text-transparent pb-6">
              Students of Other State Universities
            </h2>
            <CtaButton href="/register/external" variant="secondary">
              Register for Best Innovator and BESA Awards
            </CtaButton>
          </div>
        </div> */}
      </div>

      <div
        aria-hidden="true"
        className="-z-30 absolute inset-x-0 bottom-0 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-amber-100/20 opacity-30" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(251,191,36,0.12),transparent)]" />
      </div>
    </section>
  );
}
