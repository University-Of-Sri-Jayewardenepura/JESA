"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";

const Nav: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<>
			<nav className="container relative z-50 flex h-16 max-w-[1216px] items-center justify-between lg:h-full">
				{/* Logo */}
				<Link
					className="flex items-center transition-colors hover:text-slate-300"
					href="/"
				>
					<Image
						alt="JESA 2026"
						className="ml-[-0.4rem] h-auto w-auto lg:ml-[-1.2rem]"
						height={20}
						src="/images/jesa-min.png"
						width={72}
					/>
					<span className="sr-only">JESA</span>
				</Link>

				{/* Main Navigation - Desktop */}
				<ul className="hidden items-center gap-x-2 lg:flex">
					<li>
						<Button
							asChild
							className="px-2.5 py-1.5 text-md transition-colors hover:text-slate-300"
							variant="ghost"
						>
							<Link href="/awards">Awards</Link>
						</Button>
					</li>
					<li>
						<Button
							asChild
							className="px-2.5 py-1.5 text-md transition-colors hover:text-slate-300"
							variant="ghost"
						>
							<Link href="/hall-of-fame">Hall of Fame</Link>
						</Button>
					</li>
					<li>
						<Button
							asChild
							className="px-2.5 py-1.5 text-md transition-colors hover:text-slate-300"
							variant="ghost"
						>
							<Link href="/magazine">Magazine</Link>
						</Button>
					</li>
				</ul>

				{/* Right Side Actions - Desktop */}
				<div className="hidden items-center gap-x-5 lg:flex">
					<Button
						asChild
						className="px-2.5 py-1.5 text-md transition-colors hover:text-slate-300"
						variant="ghost"
					>
						<Link href="/terms">Terms & Conditions</Link>
					</Button>
					<Button
						asChild
						className="group h-8 rounded-full border border-gray-600 bg-transparent text-md transition-colors hover:border-primary hover:bg-primary"
						variant="outline"
					>
						<Link
							className="px-2 transition-colors group-hover:text-secondary"
							href="/register/2026"
						>
							Register Now
						</Link>
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<button
					className="transition-colors hover:text-slate-300 lg:hidden"
					onClick={toggleMenu}
					type="button"
				>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</nav>

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<div className="fixed inset-x-0 top-16 bottom-0 z-40 block bg-background lg:hidden">
					<div className="flex h-full w-full flex-col justify-between pt-[55px] text-left">
						<nav className="px-5 md:px-8">
							<ul className="flex w-full flex-col overflow-y-auto">
								<li className="group/navitem relative border-slate-900 border-b">
									<Button
										asChild
										className="flex h-auto w-full items-center justify-start gap-x-1.5 whitespace-pre rounded-full py-5 text-lg text-slate-300 leading-none transition-colors duration-200 hover:text-slate-100"
										variant="ghost"
									>
										<Link href="/awards" onClick={toggleMenu}>
											Awards
										</Link>
									</Button>
								</li>
								<li className="group/navitem relative border-slate-900 border-b">
									<Button
										asChild
										className="flex h-auto w-full items-center justify-start gap-x-1.5 whitespace-pre rounded-full py-5 text-lg text-slate-300 leading-none transition-colors duration-200 hover:text-slate-100"
										variant="ghost"
									>
										<Link href="/hall-of-fame" onClick={toggleMenu}>
											Hall of Fame
										</Link>
									</Button>
								</li>
								<li className="group/navitem relative border-slate-900 border-b">
									<Button
										asChild
										className="flex h-auto w-full items-center justify-start gap-x-1.5 whitespace-pre rounded-full py-5 text-lg text-slate-300 leading-none transition-colors duration-200 hover:text-slate-100"
										variant="ghost"
									>
										<Link href="/magazine" onClick={toggleMenu}>
											Magazine
										</Link>
									</Button>
								</li>
							</ul>
						</nav>
						<div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-8">
							<CtaButton
								asChild
								className="w-full"
								onClick={toggleMenu}
								variant="secondary"
							>
								<Link href="/terms">Terms & Conditions</Link>
							</CtaButton>
							<CtaButton asChild className="w-full" onClick={toggleMenu}>
								<Link href="/register/2026">Register Now</Link>
							</CtaButton>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Nav;
