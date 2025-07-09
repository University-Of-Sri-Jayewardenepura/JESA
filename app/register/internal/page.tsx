import React from "react";
import InternalRegisterForm from "./internal-register-form";

const InternalRegister = () => {
  return (
    <section className="register-form relative px-safe pb-[120px] pt-[124px] md:pb-[136px] md:pt-[142px] lg:pb-[160px] lg:pt-[232px] xl:pb-[162px] xl:pt-[180px]">
      <div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
        <InternalRegisterForm />
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

export default InternalRegister;
