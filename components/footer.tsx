"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { contactNames } from "@/constants/contacts";

const Footer: React.FC = () => {
	return (
		<footer>
			<hr />
			<div className="mx-auto w-full max-w-screen-xl xl:pb-2">
				<div className="gap-4 p-4 px-8 py-16 sm:pb-16 md:flex md:justify-between">
					<div className="mb-12 flex flex-col gap-4">
						<Link className="flex items-center gap-2" href="/">
							<Image
								alt="JESA 2026"
								className="mt-[-1.6rem] ml-[-1.2rem] h-auto w-auto"
								height={20}
								src="/images/jesa-min.png"
								width={72}
							/>
							<span className="sr-only">JESA</span>
						</Link>
						<div className="flex items-center justify-start space-x-2">
							<Image
								alt="USJP Logo"
								className="pointer-events-none select-none"
								height={40}
								src="/images/usjp.jpg"
								width={40}
							/>
							<Image
								alt="CSDS Logo"
								className="pointer-events-none select-none"
								height={40}
								src="/images/csds.png"
								width={40}
							/>
						</div>
						<p className="max-w-xs text-slate-500 text-sm">
							Career Skills Development Society • 2025/2026 <br />
							in collaboration with Career Guidance Unit of <br /> University of
							Sri Jayewardenepura Contacts
						</p>
					</div>
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
						<div>
							<h2 className="mb-6 font-medium tracking-tighter">Contacts</h2>
							<ul className="grid gap-4">
								{contactNames.map((contact, index) => (
									<li key={index}>
										<Link
											className="cursor-pointer text-slate-500 duration-200"
											href={contact.linkedin}
										>
											{contact.name}
										</Link>{" "}
										<br />
										<Link
											className="cursor-pointer text-slate-700 duration-200"
											href={`tel:${contact.phone}`}
										>
											{contact.phone}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h2 className="mb-6 font-medium tracking-tighter">Show</h2>
							<ul className="grid gap-4">
								<li>
									<Link
										className="cursor-pointer text-slate-500 duration-200"
										href="/awards"
									>
										Awards{" "}
									</Link>
								</li>
								<li>
									<Link
										className="cursor-pointer text-slate-500 duration-200"
										href="/magazine"
									>
										Magazine{" "}
									</Link>
								</li>
								<li>
									<Link
										className="cursor-pointer text-slate-500 duration-200"
										href="/hall-of-fame"
									>
										Hall of Fame{" "}
									</Link>
								</li>
								<li>
									<Link
										className="cursor-pointer text-slate-500 duration-200"
										href="/terms"
									>
										Terms & Conditions{" "}
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="flex flex-col-reverse gap-4 rounded-md px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
					<span className="text-slate-500 text-sm sm:text-center">
						Copyright © 2026{" "}
						<a className="cursor-pointer" href="/">
							CDSD
						</a>
						. All Rights Reserved.
					</span>
					<div className="flex space-x-5 sm:mt-0 sm:justify-center">
						<Link
							href="https://www.linkedin.com/showcase/jesa-csds/"
							target="_blank"
						>
							<Linkedin className="h-6 w-6 text-gray-100 transition-colors hover:text-gray-300" />
							<span className="sr-only">LinkedIn</span>
						</Link>
						<Link href="https://facebook.com/jesa.csds" target="_blank">
							<Facebook className="h-6 w-6 text-gray-100 transition-colors hover:text-gray-300" />
							<span className="sr-only">Facebook</span>
						</Link>

						<Link href="https://www.instagram.com/jesa.csds" target="_blank">
							<Instagram className="h-6 w-6 text-gray-100 transition-colors hover:text-gray-300" />
							<span className="sr-only">Instagram</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
