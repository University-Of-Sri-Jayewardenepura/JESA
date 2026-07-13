"use client";

import type React from "react";
import { CtaButton } from "@/components/ui/cta-button";

const NotFound: React.FC = () => {
	return (
		<section className="relative flex min-h-screen items-center justify-center px-safe py-[120px]">
			<div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
				<h2 className="cta-title">404 - Page Not Found</h2>
				<p className="mt-5 max-w-[262px] text-center text-slate-500 tracking-tight md:max-w-none md:text-lg lg:mt-6 lg:text-xl">
					The page you're looking for doesn't exist.
					<br className="block md:hidden" /> Let's get you back on track.
				</p>
				<div className="relative mt-5 flex justify-center md:mt-6 lg:mt-8">
					<CtaButton href="/">Go Home</CtaButton>
				</div>
			</div>
		</section>
	);
};

export default NotFound;
