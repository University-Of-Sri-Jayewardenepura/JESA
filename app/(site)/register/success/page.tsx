"use client";
import { useSearchParams } from "next/navigation";
import { CtaButton } from "@/components/ui/cta-button";
import { WHATSAPP_LINKS } from "../../../../constants/whatsapp-links";
import { Suspense } from "react";

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const awardsParam = searchParams.get("awards") || "";
  const selectedAwards = awardsParam ? awardsParam.split(",").filter(Boolean) : [];

  const matchedLinks = selectedAwards
    .map((id) => WHATSAPP_LINKS[id])
    .filter(Boolean);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <section className="success relative px-safe pt-[124px] pb-[120px] md:pt-[142px] md:pb-[136px] lg:pt-[232px] lg:pb-[160px] xl:pt-[180px] xl:pb-[162px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] text-transparent leading-[1.125] tracking-tight md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          JESA 2026{" "}
          <span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:inline md:text-transparent">
            Registration
          </span>
          <br className="hidden md:block" /> Successful
        </h1>

        <p className="mt-5 max-w-[312px] text-center text-emerald-400 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          Registration Successful
        </p>

        {matchedLinks.length > 0 && (
          <div className="mt-8 w-full max-w-md space-y-3">
            <p className="text-sm text-slate-300 text-center">
              Join your award WhatsApp groups:
            </p>
            {matchedLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/30 border border-emerald-700/40 hover:bg-emerald-900/50 transition-colors text-sm text-slate-200 hover:text-emerald-300"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 fill-emerald-400" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="flex-1">{link.label}</span>
                <span className="text-emerald-400 text-xs">Open →</span>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 flex w-full max-w-md justify-center">
          <div className="w-5/7 sm:w-1/2">
            <CtaButton href="/">Back to Home</CtaButton>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="-z-30 absolute inset-x-0 bottom-0 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-emerald-100/20 opacity-30" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent)]" />
      </div>
    </section>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <section className="success relative px-safe pt-[124px] pb-[120px] min-h-screen flex flex-col items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </section>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
