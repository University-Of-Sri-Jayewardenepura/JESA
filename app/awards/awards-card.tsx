"use client";

import Image from "next/image";
import React from "react";
import { awards } from "@/constants/awards";
import Link from "next/link";
import { TextAnimate } from "@/components/core/text-animate";

export const AwardsPage: React.FC = () => {
  return (
    <section className="relative pt-[140px] px-safe pb-[120px] md:pt-[148px] md:pb-[136px] lg:pt-[180px] lg:pb-[160px] xl:pb-[162px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] leading-[1.125] tracking-tight text-transparent md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
          <span className="bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:text-transparent">
            Awards
          </span>
        </h1>
        <div className="mt-5 max-w-[340px]  text-center text-slate-500 tracking-tight md:max-w-[532px] md:text-lg lg:mt-6 lg:text-xl">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            startOnView={false}
            delay={0.3}
            duration={0.5}
          >
            Discover sixteen prestigious awards celebrating excellence across
            university life at JESA 2025. Each award recognizes outstanding
            undergraduates for their dedication in leadership, innovation,
            academics, and social responsibility.
          </TextAnimate>
        </div>
      </div>

      <div className="py-16 md:py-28 lg:py-32">
        <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-12 px-4 md:px-6">
          {awards.map((award, index) => (
            <div key={award.id} className="pb-4 md:pb-12 lg:pb-24">
              {award.id === "7" && (
                <div className="flex flex-col items-center justify-center pb-[6rem] max-w-7xl text-center">
                  <h2 className="relative z-20 bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[32px] leading-[1.125] tracking-tight text-transparent md:text-[40px] lg:text-[48px] xl:text-[56px]">
                    <span className="bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:text-transparent">
                      Best Employability Skills Achiever (BESA)
                    </span>
                  </h2>
                  <p className="mt-[1rem] text-slate-500 max-w-xl text-center tracking-tight md:text-lg lg:text-xl">
                    Dedicated to the most optimistic and brilliant all-rounded
                    undergraduate from each faculty. (except for the faculty of
                    graduate studies) The winner is excelled in academics,
                    sports, and other extracurricular activities.
                  </p>
                </div>
              )}

              <div
                className="border border-slate-900 shadow-2xl rounded-[10px] backdrop-blur-lg max-w-7xl"
                style={{ background: "var(--background-card)" }}
              >
                <div className="flex justify-center flex-col md:flex-row p-6 md:p-8">
                  <div className="w-full md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
                    <Image
                      src={award.image}
                      alt={award.name}
                      width={180}
                      height={180}
                      className="h-fit w-[100px] md:w-[180px]"
                      priority
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-title bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text text-transparent">
                        {award.name}
                      </h3>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        {award.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {award.sponsors &&
                      award.sponsors.filter(
                        (sponsor) => sponsor.type === "Platinum"
                      ).length > 0 ? (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Platinum Sponsors
                          </h4>
                          <div className="flex flex-wrap gap-4 justify-start">
                            {award.sponsors
                              .filter((sponsor) => sponsor.type === "Platinum")
                              .map((sponsor) => (
                                <Link
                                  href={sponsor.link}
                                  key={sponsor.year}
                                  className="group"
                                >
                                  <div className="flex flex-col items-center space-y-2">
                                    <span className="text-xs bg-gradient-to-t from-slate-400 to-slate-200 bg-clip-text text-transparent font-semibold">
                                      {sponsor.year}
                                    </span>
                                    <Image
                                      src={sponsor.imgSrc}
                                      alt={`Platinum Sponsor ${sponsor.year}`}
                                      className="rounded-[4px] shadow-lg w-[60px] md:w-[75px] transition-transform group-hover:scale-105"
                                      width={75}
                                      height={75}
                                      quality={100}
                                    />
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      ) : null}

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Who will be the Sponsors of 2025?
                        </h4>
                        <div className="flex flex-wrap gap-3 md:gap-6 justify-start">
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-xs bg-gradient-to-t from-amber-500 to-amber-300 bg-clip-text text-transparent font-semibold">
                              2025
                            </span>
                            <Image
                              src="/images/companies/question.png"
                              alt="Gold Sponsor 2025"
                              className="rounded-[4px] shadow-lg"
                              width={75}
                              height={75}
                              quality={100}
                            />
                            <span className="text-xs bg-gradient-to-t from-amber-500 to-amber-300 bg-clip-text text-transparent font-semibold">
                              Gold
                            </span>
                          </div>

                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-xs bg-gradient-to-t from-slate-400 to-slate-300 bg-clip-text text-transparent font-semibold">
                              2025
                            </span>
                            <Image
                              src="/images/companies/question.png"
                              alt="Platinum Sponsor 2025"
                              className="rounded-[4px] shadow-lg"
                              width={90}
                              height={90}
                              quality={100}
                            />
                            <span className="text-xs bg-gradient-to-t from-slate-400 to-slate-300 bg-clip-text text-transparent font-semibold">
                              Platinum
                            </span>
                          </div>

                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-xs bg-gradient-to-t from-slate-300 to-slate-100 bg-clip-text text-transparent font-semibold">
                              2025
                            </span>
                            <Image
                              src="/images/companies/question.png"
                              alt="Silver Sponsor 2025"
                              className="rounded-[4px] shadow-lg"
                              width={75}
                              height={75}
                              quality={100}
                            />
                            <span className="text-xs bg-gradient-to-t from-slate-300 to-slate-100 bg-clip-text text-transparent font-semibold">
                              Silver
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 -z-30 h-[490px] md:h-[629px] lg:h-[641px] xl:h-[689px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-b from-transparent to-amber-100/20" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(closest-side,rgba(251,191,36,0.12),transparent)]" />
      </div>
    </section>
  );
};

export default AwardsPage;
