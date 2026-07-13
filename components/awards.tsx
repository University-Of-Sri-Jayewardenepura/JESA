"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { awards } from "@/constants/awards";

// Add isNew property to specific awards (you can modify this logic later)
const awardCategories = awards.map((award, index) => ({
	id: award.id,
	title: award.name,
	image: award.image,
	isNew: index === 7 || index === 15 || index === 16,
}));

export default function Awards() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		// Set window width on client-side only
		setWindowWidth(window.innerWidth);

		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handlePrev = () => {
		setCurrentIndex((prev) => {
			const visibleCount = getVisibleCount();
			const maxIdx = Math.max(0, awardCategories.length - visibleCount);
			if (prev === 0) return maxIdx;
			return prev - 1;
		});
	};

	const handleNext = () => {
		setCurrentIndex((prev) => {
			const visibleCount = getVisibleCount();
			const maxIdx = Math.max(0, awardCategories.length - visibleCount);
			if (prev >= maxIdx) return 0;
			return prev + 1;
		});
	};

	// Calculate how many items can be visible at once
	const getVisibleCount = () => {
		if (windowWidth >= 1024) return 3; // Desktop: show 3
		if (windowWidth >= 768) return 2; // Tablet: show 2
		return 1; // Mobile: show 1
	};

	// Adjust current index to prevent overscroll
	const maxIndex = Math.max(0, awardCategories.length - getVisibleCount());
	const adjustedIndex = Math.min(currentIndex, maxIndex);

	// Calculate item width including gap
	const getItemWidth = () => {
		if (windowWidth >= 1024) return 320 + 20; // lg:w-80 (320px) + gap
		return 264 + 16; // w-[264px] + gap
	};

	return (
		<section className="overflow-hidden px-safe pt-[120px] pb-[76px] md:pt-[146px] md:pb-0 lg:pt-44 xl:pt-[117px]">
			<div className="container mx-auto px-5 md:px-8">
				<h2 className="secondary-title">Award Categories</h2>
			</div>
			<div className="relative mx-auto mt-8 w-full lg:mt-9">
				<div className="relative z-10">
					<div
						className="overflow-hidden"
						style={{
							paddingLeft: "max(calc((100vw - 1280px) / 2 + 2rem), 2rem)",
						}}
					>
						<div
							className="flex items-center justify-start gap-4 pr-5 pb-4 transition-transform duration-500 ease-out md:pr-8 lg:gap-5"
							style={{
								transform: `translateX(-${adjustedIndex * getItemWidth()}px)`,
							}}
						>
							{awardCategories.map((category, index) => {
								return (
									<div
										className="relative h-[348px] w-[264px] flex-shrink-0 lg:h-[400px] lg:w-80"
										key={index}
									>
										<div className="relative h-full w-full overflow-hidden">
											{/* Award image centered */}
											<div className="absolute inset-0 flex items-center justify-center p-8 pt-[100px]">
												<Image
													alt={category.title}
													className="h-fit w-[90px] object-contain lg:w-[100px]"
													height={180}
													priority={index < 2}
													src={category.image}
													width={180}
												/>
											</div>
											<div
												className="pointer-events-none absolute inset-0"
												style={{
													backgroundImage: "url('/images/noise-pixel.png')",
													backgroundRepeat: "repeat",
													opacity: 0.1,
													mixBlendMode: "overlay",
												}}
											/>
											<div
												className="pointer-events-none absolute inset-0"
												style={{
													background: "var(--background-card)",
													mixBlendMode: "overlay",
													opacity: 0.5,
												}}
											/>
											<h3 className="absolute top-5 left-5 max-w-44 font-medium text-[20px] leading-tight tracking-tightest lg:top-6 lg:left-6 lg:text-[24px]">
												{category.title}
											</h3>

											{category.isNew && (
												<span className="absolute top-[23px] right-5 flex h-5 items-center justify-center rounded bg-emerald-400/[0.5] px-3 font-semibold text-[8px] text-gray-90 uppercase leading-none tracking-tighter backdrop-blur-[2px] lg:top-[29px] lg:right-6">
													New
												</span>
											)}

											<div
												aria-hidden="true"
												className="pointer-events-none absolute inset-0 rounded-[10px] border border-slate-700 opacity-60 mix-blend-overlay"
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className="relative pl-5 md:pl-8">
						<button
							aria-label="Previous slide"
							className="group -bottom-[68px] absolute right-[76px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full md:right-[85px] lg:top-[-490px] lg:right-[90px]"
							onClick={handlePrev}
						>
							<ArrowLeft size={20} />
							<span className="sr-only">Previous slide</span>
						</button>

						<button
							aria-label="Next slide"
							className="group -bottom-[68px] absolute right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-12 transition-colors hover:bg-gray-20 focus-visible:rounded-full md:right-8 lg:top-[-490px] lg:right-8"
							onClick={handleNext}
						>
							<ArrowRight size={20} />
							<span className="sr-only">Next slide</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
