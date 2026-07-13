"use client";

import Link from "next/link";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaButtonProps extends React.ComponentProps<typeof Button> {
	href?: string;
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "secondary";
}

export function CtaButton({
	href,
	children,
	className,
	variant = "default",
	asChild = false,
	...props
}: CtaButtonProps) {
	const isDefault = variant === "default";

	return (
		<div className="relative w-full">
			<div className="group relative w-full rounded-full p-1 transition-colors">
				{/* Border around button */}
				<div className="-inset-px absolute rounded-full bg-gradient-to-b from-slate-500 to-slate-900" />

				{/* Gold gradient background - for both default and secondary variants */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-300/10 via-background to-slate-300/10" />

				{/* Regular button in the middle */}
				<Button
					asChild={asChild || Boolean(href)}
					className={cn(
						"relative z-10 w-full rounded-full font-semibold transition-all",
						isDefault
							? "bg-white hover:bg-slate-200 !text-slate-950 hover:!text-secondary"
							: "text-white hover:bg-white/10 hover:text-white",
						className,
					)}
					variant={isDefault ? "default" : "ghost"}
					{...props}
				>
					{href ? (
						<Link className="block w-full text-center" href={href}>
							{children}
						</Link>
					) : (
						children
					)}
				</Button>
			</div>

			{/* Glow effect - only for default variant */}
			{isDefault && (
				<div
					aria-hidden="true"
					className="-bottom-1 -translate-x-1/2 pointer-events-none absolute left-1/2 z-20 h-[66px] w-[187px] bg-gradient-to-b from-transparent to-yellow-400/20 opacity-40 mix-blend-plus-lighter blur-3xl"
				/>
			)}
		</div>
	);
}
