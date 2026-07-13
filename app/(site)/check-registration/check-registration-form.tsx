"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AWARDS } from "@/constants/form";

const FormSchema = z.object({
	Whatsapp: z.string().refine((value) => /^7\d{0,8}$/.test(value), {
		message: "Please enter WhatsApp number without the 0.",
	}),
});

interface User {
	Name: string;
	Whatsapp: string;
	Email: string;
	RegNo: string;
}

interface ResponseData {
	user: User[];
}

const awardByPrefix: [string, string][] = [
	["TP", AWARDS.BEST_TEAM_PLAYER],
	["BL", AWARDS.BEST_LEADER],
	["BC", AWARDS.BEST_COMMUNICATOR],
	["CD", AWARDS.BEST_CREATIVE_DESIGNER],
	["YE", AWARDS.BEST_YOUNG_ENTREPRENEUR],
	["BI", AWARDS.BEST_INNOVATOR],
	["CSR", AWARDS.CSR_AWARD],
	["FMSC", AWARDS.BESA_MANAGEMENT_STUDIES_AND_COMMERCE],
	["FHSS", AWARDS.BESA_HUMANITIES_AND_SOCIAL_SCIENCES],
	["FAS", AWARDS.BESA_APPLIED_SCIENCES],
	["FOT", AWARDS.BESA_TECHNOLOGY],
	["FAHS", AWARDS.BESA_ALLIED_HEALTH_SCIENCES],
	["FOE", AWARDS.BESA_ENGINEERING],
	["FMS", AWARDS.BESA_MEDICAL_SCIENCES],
	["FDS", AWARDS.BESA_DENTAL_SCIENCES],
	["FUAB", AWARDS.BESA_URBAN_AQUATIC],
	["IU", AWARDS.BESA_INTER_UNIVERSITY],
	["BIU", AWARDS.BESA_INTER_UNIVERSITY],
];

function regNoToAward(reg: string): string {
	const entry = awardByPrefix.find(([prefix]) => reg.startsWith(prefix));
	return entry ? entry[1] : "Unknown Award";
}

export default function CheckRegistrationForm() {
	const [responseData, setResponseData] = useState<ResponseData | null>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			Whatsapp: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		startTransition(async () => {
			try {
				const response = await fetch("/api/getregno", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				if (response.ok) {
					const result: ResponseData = await response.json();
					setResponseData(result);
				} else {
					console.error("Error:", response.status);
					setResponseData(null);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		});
	}

	return (
		<section className="register relative px-safe pt-[124px] pb-[120px] md:pt-[142px] md:pb-[136px] lg:pt-[232px] lg:pb-[160px] xl:pt-[180px] xl:pb-[162px]">
			<div className="container mx-auto flex flex-col items-center justify-center lg:max-w-5xl">
				<h1 className="relative z-20 max-w-[340px] bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text pb-2 text-center font-title text-[40px] text-transparent leading-[1.125] tracking-tight md:max-w-none md:text-[56px] lg:text-[64px] xl:text-[72px]">
					<span className="block bg-[linear-gradient(180deg,rgba(251,191,36,1)_0%,rgba(251,191,36,0)_70%)] bg-clip-text text-white md:inline md:text-transparent">
						Check Registration
					</span>
				</h1>

				<div className="mx-auto w-full max-w-xl px-4 pt-[32px]">
					<Form {...form}>
						<form
							className="space-y-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 px-10 py-6 backdrop-blur-sm"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
								Enter your WhatsApp number
							</h3>
							<FormField
								control={form.control}
								name="Whatsapp"
								render={({ field }) => (
									<FormItem className="w-full">
										<div className="flex items-center gap-3">
											<FormControl>
												<Input
													placeholder="7XXXXXXXX"
													{...field}
													className="flex-1"
													inputMode="numeric"
													maxLength={9}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="pt-4">
								<Button
									className="w-full rounded-[8px] py-3 font-medium text-base"
									disabled={isPending}
									type="submit"
								>
									{isPending ? "Checking..." : "Check Registration"}
								</Button>
							</div>

							{responseData && (
								<div className="mt-6 rounded-[8px] border bg-card/50 p-6 text-card-foreground shadow-sm backdrop-blur">
									<div className="space-y-4">
										<div className="space-y-1 text-center">
											<h3 className="bg-gradient-to-br from-sky-300 to-sky-500 bg-clip-text font-bold text-2xl text-transparent">
												{responseData.user[0]?.Name}
											</h3>
											<p className="text-muted-foreground text-sm">
												WhatsApp Number: +94
												{responseData.user[0]?.Whatsapp}
											</p>
											<p className="text-muted-foreground text-sm">
												Email: {responseData.user[0]?.Email}
											</p>
										</div>

										<div className="space-y-2">
											<h4 className="font-semibold text-lg">
												Awards Applied For
											</h4>
											<ul className="divide-y divide-border rounded-[4px] border">
												{responseData.user.map((item, index) => (
													<li
														className="flex items-center justify-between p-3"
														key={index}
													>
														<div className="font-medium">
															{regNoToAward(item.RegNo)}
														</div>
														<div className="text-muted-foreground text-sm">
															{item.RegNo}
														</div>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							)}
						</form>
					</Form>
				</div>
			</div>
		</section>
	);
}
