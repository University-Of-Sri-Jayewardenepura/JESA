"use client";

import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Sponsor data organized by tier
interface Sponsor {
	name: string;
	logo: string;
	available: boolean;
}

interface SponsorTier {
	title: string;
	gradient: string;
	sponsors: Sponsor[];
}

const sponsorTiers: SponsorTier[] = [
	{
		title: "Super Platinum Partners",
		gradient: "from-violet-400 via-fuchsia-300 to-violet-400",
		sponsors: [
			{
				name: "Celogen Lanka (Pvt) Ltd",
				logo: "/images/companies/celogen.png",
				available: false,
			},
			{
				name: "Iconique (Pvt) Ltd",
				logo: "/images/companies/iconique.png",
				available: false,
			},
		],
	},
	{
		title: "Super Silver Partners",
		gradient: "from-slate-300 via-slate-100 to-slate-300",
		sponsors: [
			{
				name: "Hayleys PLC",
				logo: "/images/companies/hayleys.png",
				available: true,
			},
		],
	},
	{
		title: "Platinum Partners",
		gradient: "from-slate-400 via-slate-200 to-slate-400",
		sponsors: [
			{
				name: "Aberdeen Holdings",
				logo: "/images/companies/aberdeen-holdings.png",
				available: true,
			},
			{
				name: "Alpha Apparels Ltd",
				logo: "/images/companies/alpha-apparels.png",
				available: true,
			},
			{
				name: "CIC Holdings PLC",
				logo: "/images/companies/cic.png",
				available: false,
			},
			{
				name: "Brandix Apparel (Pvt) Ltd",
				logo: "/images/companies/brandix.png",
				available: true,
			},
			{
				name: "Hemas Holdings PLC",
				logo: "/images/companies/hemas.png",
				available: false,
			},
			{
				name: "Diesel & Motor Engineering PLC",
				logo: "/images/companies/dimo.png",
				available: true,
			},
			{
				name: "Creative Software",
				logo: "/images/companies/creative-software.png",
				available: true,
			},
			{
				name: "Mobitel (Pvt) Ltd",
				logo: "/images/companies/mobitel.png",
				available: true,
			},
			{
				name: "John Keells Group",
				logo: "/images/companies/john-keells.png",
				available: false,
			},
		],
	},
	{
		title: "Gold Partners",
		gradient: "from-amber-500 via-amber-300 to-amber-500",
		sponsors: [
			{
				name: "Abans PLC",
				logo: "/images/companies/abans.png",
				available: false,
			},
			{
				name: "Aberdeen Holdings",
				logo: "/images/companies/aberdeen-holdings.png",
				available: true,
			},
		],
	},
	{
		title: "Silver Partners",
		gradient: "from-slate-400 via-slate-200 to-slate-400",
		sponsors: [
			{
				name: "Aberdeen Holdings",
				logo: "/images/companies/aberdeen-holdings.png",
				available: true,
			},
			{
				name: "Modern Pack Lanka (Pvt) Ltd",
				logo: "/images/companies/modern-pack.png",
				available: false,
			},
			{
				name: "Alan Story (Pvt) Ltd",
				logo: "/images/companies/alan-story.png",
				available: true,
			},
			{
				name: "Professional Outsourcing & Consulting (Pvt) Ltd",
				logo: "/images/companies/poc.png",
				available: false,
			},
		],
	},
];

export default function Sponsors() {
	return (
		<section className="px-safe pt-[124px] pb-[80px] md:pt-[142px] md:pb-[136px] lg:pt-[232px] lg:pb-[160px] xl:pt-[180px] xl:pb-[162px]">
			<div className="container mx-auto px-5 md:px-8">
				{/* Section Title */}
				<h2 className="secondary-title mb-8 text-center md:mb-10 lg:mb-12">
					Made Possible by
				</h2>

				{/* Sponsor Tiers */}
				<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
					{sponsorTiers.map((tier) => (
						<div key={tier.title} className="flex flex-col items-center">
							{/* Tier Title */}
							<h3
								className={`mb-4 bg-gradient-to-r ${tier.gradient} bg-clip-text font-title text-lg font-medium text-transparent md:mb-6 md:text-xl lg:mb-8 lg:text-2xl`}
							>
								{tier.title}
							</h3>

							{/* Sponsors Grid - Centered using Flex */}
							<div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
								{tier.sponsors.map((sponsor, index) => (
									<Tooltip key={`${tier.title}-${sponsor.name}-${index}`}>
										<TooltipTrigger asChild>
											{sponsor.available ? (
												<Image
													alt={sponsor.name}
													className="h-[80px] w-[80px] cursor-pointer rounded-2xl bg-white p-4 object-contain opacity-90 shadow-sm transition-all duration-300 hover:scale-105 hover:opacity-100 hover:shadow-lg hover:shadow-white/20 md:h-[100px] md:w-[100px] md:p-5 lg:h-[120px] lg:w-[120px] lg:p-6"
													height={120}
													quality={100}
													src={sponsor.logo}
													width={120}
												/>
											) : (
												<div className="flex h-[80px] w-[80px] cursor-pointer items-center justify-center rounded-2xl bg-white p-3 text-center text-[10px] text-slate-400 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 md:h-[100px] md:w-[100px] md:p-4 md:text-xs lg:h-[120px] lg:w-[120px] lg:p-5">
													{sponsor.name}
												</div>
											)}
										</TooltipTrigger>
										<TooltipContent
											className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 text-xs shadow-xl"
											sideOffset={8}
										>
											{sponsor.name}
										</TooltipContent>
									</Tooltip>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
