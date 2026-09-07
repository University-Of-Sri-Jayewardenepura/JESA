"use client";

import { useEffect, useState } from "react";

/** Floating countdown timer targeting September 9, 2026 6:00 PM (UTC+5:30). */
export default function CountdownTimer() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [isExpired, setIsExpired] = useState(false);

	useEffect(() => {
		const target = new Date("2026-09-09T18:00:00+05:30").getTime();

		function tick() {
			const diff = target - Date.now();
			if (diff <= 0) {
				setIsExpired(true);
				return;
			}
			setTimeLeft({
				days: Math.floor(diff / 86400000),
				hours: Math.floor((diff / 3600000) % 24),
				minutes: Math.floor((diff / 60000) % 60),
				seconds: Math.floor((diff / 1000) % 60),
			});
		}

		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	if (isExpired) return null;

	const units = [
		{ label: "Days", value: timeLeft.days },
		{ label: "Hrs", value: timeLeft.hours },
		{ label: "Min", value: timeLeft.minutes },
		{ label: "Sec", value: timeLeft.seconds },
	];

	return (
		<div className="mt-8">
			<div className="overflow-hidden rounded-2xl bg-[#0a0612]/90 px-4 py-3 shadow-[0_0_40px_rgba(219,190,69,0.06)] backdrop-blur-sm sm:px-5 sm:py-4">
				<p className="mb-2 text-center font-semibold text-[10px] tracking-[0.2em] text-[#dbbe45]/70 uppercase sm:text-[11px]">
					Register Closing Soon
				</p>
				<div className="flex items-center justify-center gap-2 sm:gap-3">
					{units.map((unit, i) => (
						<div key={unit.label} className="flex items-center gap-2 sm:gap-3">
							<div className="flex flex-col items-center">
								<span className="flex size-10 items-center justify-center rounded-lg border border-[rgba(219,190,69,0.15)] bg-[#120919] font-bold text-[#dbbe45] text-base tabular-nums sm:size-12 sm:text-lg">
									{String(unit.value).padStart(2, "0")}
								</span>
								<span className="mt-1 text-white/30 text-[8px] tracking-wider uppercase sm:text-[9px]">
									{unit.label}
								</span>
							</div>
							{i < units.length - 1 && (
								<span className="mb-4 text-[#dbbe45]/40 text-xs">:</span>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
