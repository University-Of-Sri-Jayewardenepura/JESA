"use client";

import {
	AlertCircle,
	ArrowUpRight,
	CheckCircle2,
	ChevronDown,
	Clock3,
	Eye,
	FileCheck2,
	Mail,
	MailCheck,
	MailPlus,
	MoreHorizontal,
	RefreshCw,
	Search,
	Send,
	SlidersHorizontal,
	UserSearch,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Placeholder records keep this page focused on layout until API integration is added.
const emailRecords = [
	{
		id: "JESA26-0148",
		name: "Nethmi Perera",
		email: "nethmi.perera@example.com",
		award: "Young Entrepreneur of the Year",
		status: "Ready",
		attempts: 0,
		lastSent: "Not sent yet",
	},
	{
		id: "JESA26-0147",
		name: "Kavindu Fernando",
		email: "kavindu.f@example.com",
		award: "Outstanding Startup Award",
		status: "Delivered",
		attempts: 1,
		lastSent: "22 Aug, 10:42 AM",
	},
	{
		id: "JESA26-0146",
		name: "Sajini Wickramasinghe",
		email: "sajini.w@example.com",
		award: "Business Excellence Award",
		status: "Processing",
		attempts: 1,
		lastSent: "22 Aug, 10:38 AM",
	},
	{
		id: "JESA26-0145",
		name: "Ravindu Jayasena",
		email: "ravindu.j@example.com",
		award: "Social Impact Award",
		status: "Failed",
		attempts: 2,
		lastSent: "22 Aug, 09:16 AM",
	},
	{
		id: "JESA26-0144",
		name: "Dilki Gunawardena",
		email: "dilki.g@example.com",
		award: "Women in Business Award",
		status: "Delivered",
		attempts: 1,
		lastSent: "21 Aug, 04:55 PM",
	},
] as const;

const summaryCards = [
	{
		label: "Ready to send",
		value: "128",
		detail: "Registration emails",
		icon: MailPlus,
		accent: "text-primary bg-primary/10 border-primary/20",
	},
	{
		label: "In progress",
		value: "06",
		detail: "Queued or processing",
		icon: Clock3,
		accent: "text-blue-300 bg-blue-500/10 border-blue-400/20",
	},
	{
		label: "Delivered",
		value: "1,284",
		detail: "91.3% delivery rate",
		icon: CheckCircle2,
		accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
	},
	{
		label: "Needs attention",
		value: "12",
		detail: "Failed or bounced",
		icon: AlertCircle,
		accent: "text-red-300 bg-red-500/10 border-red-400/20",
	},
] as const;

type LookupRegistrationRecord = {
	applicationId: string;
	applicationReferenceNumber: string;
	applicantType: "internal" | "external";
	recipient: { name: string; email: string };
	registrationStatus: "pending" | "generating" | "generated" | "failed";
	awardRegistrations: ReadonlyArray<{
		awardLabel: string;
		registrationNumber: string;
	}>;
};

const registrationRecords = [
	{
		applicationId: "76062d3e-4ceb-4e34-a880-9c2a04f5d901",
		applicationReferenceNumber: "J26-APP-0148",
		applicantType: "external",
		recipient: {
			name: "Nethmi Perera",
			email: "nethmi.perera@example.com",
		},
		registrationStatus: "generated",
		awardRegistrations: [
			{
				awardLabel: "Young Entrepreneur of the Year",
				registrationNumber: "JESA26-YE-0148",
			},
			{
				awardLabel: "Social Impact Award",
				registrationNumber: "JESA26-SI-0062",
			},
		],
	},
	{
		applicationId: "88bf7b8d-0c65-4014-b9a2-11ea73009e28",
		applicationReferenceNumber: "J26-APP-0143",
		applicantType: "internal",
		recipient: {
			name: "Tharindu Silva",
			email: "tharindu.s@example.com",
		},
		registrationStatus: "pending",
		awardRegistrations: [],
	},
	{
		applicationId: "c440b75c-cbb8-493c-b862-28f351519767",
		applicationReferenceNumber: "J26-APP-0139",
		applicantType: "external",
		recipient: {
			name: "Hasini Abeysekara",
			email: "hasini.a@example.com",
		},
		registrationStatus: "failed",
		awardRegistrations: [],
	},
] as const satisfies readonly LookupRegistrationRecord[];

const statusStyles: Record<(typeof emailRecords)[number]["status"], string> = {
	Ready: "border-primary/25 bg-primary/10 text-primary",
	Delivered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
	Processing: "border-blue-400/25 bg-blue-500/10 text-blue-300",
	Failed: "border-red-400/25 bg-red-500/10 text-red-300",
};

function StatusBadge({
	status,
}: {
	status: (typeof emailRecords)[number]["status"];
}) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${statusStyles[status]}`}
		>
			<span className="size-1.5 rounded-full bg-current" />
			{status}
		</span>
	);
}

const registrationStatusStyles: Record<
	LookupRegistrationRecord["registrationStatus"],
	string
> = {
	generated: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
	generating: "border-blue-400/25 bg-blue-500/10 text-blue-300",
	pending: "border-primary/25 bg-primary/10 text-primary",
	failed: "border-red-400/25 bg-red-500/10 text-red-300",
};

const registrationStatusLabels: Record<
	LookupRegistrationRecord["registrationStatus"],
	string
> = {
	generated: "Generated",
	generating: "Generating",
	pending: "Pending",
	failed: "Failed",
};

function RegistrationStatusBadge({
	status,
}: {
	status: LookupRegistrationRecord["registrationStatus"];
}) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${registrationStatusStyles[status]}`}
		>
			<span className="size-1.5 rounded-full bg-current" />
			{registrationStatusLabels[status]}
		</span>
	);
}

function RegistrationLookupTab() {
	const recordsWithNumbers = registrationRecords.filter(
		(record) => record.awardRegistrations.length > 0,
	).length;

	return (
		<section aria-labelledby="registration-lookup" className="space-y-4">
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
				<div className="rounded-2xl border border-border/80 bg-card/45 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
						<UserSearch className="size-5" />
					</div>
					<h2 className="mt-5 font-semibold text-xl" id="registration-lookup">
						Find a registration
					</h2>
					<p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-6">
						Search by application reference, registration number, applicant
						name, or email address.
					</p>
					<div className="mt-5 flex flex-col gap-2 sm:flex-row">
						<label className="relative flex-1">
							<Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<input
								className="h-11 w-full rounded-lg border border-input bg-background/60 pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
								placeholder="e.g. J26-APP-0148 or applicant name"
								type="search"
							/>
							<span className="sr-only">Search registrations</span>
						</label>
						<Button className="h-11 px-5" type="button">
							<Search className="size-4" /> Search records
						</Button>
					</div>
				</div>

				<aside className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5">
					<div className="flex items-center justify-between">
						<span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<FileCheck2 className="size-4" />
						</span>
						<span className="text-muted-foreground text-xs">2026 intake</span>
					</div>
					<p className="mt-5 font-semibold text-3xl tabular-nums">
						{recordsWithNumbers} / {registrationRecords.length}
					</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Have registration numbers
					</p>
					<div className="mt-5 border-primary/15 border-t pt-4 text-xs">
						<span className="text-muted-foreground">
							Each award has its own registration number.
						</span>
					</div>
				</aside>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border/80 bg-card/45 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm">
				<div className="flex flex-col gap-4 border-border/80 border-b px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-lg">Recent registrations</h3>
							<span className="rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground text-xs">
								3 results
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-sm">
							See which applicants already have registration numbers.
						</p>
					</div>
					<label className="relative block sm:w-48">
						<select className="h-10 w-full appearance-none rounded-lg border border-input bg-background/60 px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
							<option>All records</option>
							<option>Has registration number</option>
							<option>No registration number</option>
						</select>
						<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<span className="sr-only">
							Filter registration number availability
						</span>
					</label>
				</div>

				<div className="divide-y divide-border/70">
					{registrationRecords.map((record) => (
						<article
							className="grid gap-5 p-4 transition-colors hover:bg-muted/10 sm:p-6 lg:grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.25fr)_auto] lg:items-center"
							key={record.applicationId}
						>
							<div className="flex items-start gap-3">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/40 font-semibold text-primary text-sm">
									{record.recipient.name
										.split(" ")
										.map((part) => part[0])
										.join("")}
								</span>
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<p className="font-semibold">{record.recipient.name}</p>
									</div>
									<p className="mt-1 truncate text-muted-foreground text-xs">
										{record.recipient.email}
									</p>
									<p className="mt-1.5 font-medium text-primary text-xs">
										{record.applicationReferenceNumber}
										<span className="ml-2 font-normal text-muted-foreground capitalize">
											{record.applicantType}
										</span>
									</p>
								</div>
							</div>
							<div>
								<p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
									Registration numbers
								</p>
								{record.awardRegistrations.length > 0 ? (
									<ul className="space-y-2">
										{record.awardRegistrations.map((award) => (
											<li
												className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2"
												key={award.registrationNumber}
											>
												<span className="font-semibold text-primary text-sm">
													{award.registrationNumber}
												</span>
												<span className="truncate text-muted-foreground text-xs">
													{award.awardLabel}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground text-sm">
										Not generated yet
									</p>
								)}
							</div>
							<div className="flex items-center justify-between gap-3 lg:justify-end">
								<RegistrationStatusBadge status={record.registrationStatus} />
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default function EmailServiceUI() {
	const [activeWorkspace, setActiveWorkspace] = useState<
		"message-sending" | "registration-lookup"
	>("message-sending");

	return (
		<main className="relative min-h-screen overflow-hidden bg-background px-4 pt-28 pb-20 text-foreground sm:px-6 lg:px-8">
			{/* Restrained brand lighting separates the workspace from the site shell. */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_0%,rgba(219,190,69,0.10),transparent_34%),radial-gradient(circle_at_85%_8%,rgba(89,44,85,0.24),transparent_32%)]" />

			<div className="relative mx-auto max-w-[1440px] space-y-6">
				{/* Page heading and primary actions */}
				<header className="flex flex-col gap-6 border-border/70 border-b pb-7 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl">
						<div className="mb-3 flex items-center gap-2 text-primary">
							<span className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
								<Mail className="size-3.5" />
							</span>
							<p className="font-semibold text-xs uppercase tracking-[0.2em]">
								Communication centre
							</p>
						</div>
						<h1 className="font-title text-4xl tracking-tight sm:text-5xl">
							Email Service
						</h1>
						<p className="mt-3 max-w-2xl text-muted-foreground text-sm leading-6 sm:text-base">
							Review and prepare registration emails for JESA / BESA 2026
							applicants from one organized workspace.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							className="h-10 border-border bg-card/60"
							type="button"
							variant="outline"
						>
							<RefreshCw className="size-4" />
							{activeWorkspace === "message-sending"
								? "Refresh"
								: "Refresh records"}
						</Button>
						{activeWorkspace === "message-sending" && (
							<Button className="h-10" type="button">
								<Send className="size-4" /> Send test email
							</Button>
						)}
					</div>
				</header>

				{/* Primary workspace navigation keeps lookup and delivery tasks distinct. */}
				<nav
					aria-label="Email service workspaces"
					className="grid rounded-xl border border-border/80 bg-card/45 p-1.5 shadow-sm backdrop-blur-sm sm:inline-grid sm:grid-cols-2"
				>
					<button
						aria-current={
							activeWorkspace === "message-sending" ? "page" : undefined
						}
						className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							activeWorkspace === "message-sending"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
						}`}
						onClick={() => setActiveWorkspace("message-sending")}
						type="button"
					>
						<Send className="size-4" /> Message Sending
					</button>
					<button
						aria-current={
							activeWorkspace === "registration-lookup" ? "page" : undefined
						}
						className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							activeWorkspace === "registration-lookup"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
						}`}
						onClick={() => setActiveWorkspace("registration-lookup")}
						type="button"
					>
						<UserSearch className="size-4" /> Registration Lookup
					</button>
				</nav>

				{activeWorkspace === "message-sending" ? (
					<>
						{/* Delivery overview */}
						<section aria-labelledby="delivery-overview">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="font-semibold text-sm" id="delivery-overview">
									Delivery overview
								</h2>
								<p className="text-muted-foreground text-xs">
									Updated a few moments ago
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
								{summaryCards.map((card) => {
									const Icon = card.icon;
									return (
										<article
											className="group rounded-2xl border border-border/80 bg-card/45 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-colors hover:border-primary/35"
											key={card.label}
										>
											<div className="flex items-start justify-between gap-4">
												<div>
													<p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
														{card.label}
													</p>
													<p className="mt-3 font-semibold text-3xl tabular-nums tracking-tight">
														{card.value}
													</p>
												</div>
												<span
													className={`rounded-xl border p-2.5 ${card.accent}`}
												>
													<Icon className="size-4" />
												</span>
											</div>
											<p className="mt-4 text-muted-foreground text-xs">
												{card.detail}
											</p>
										</article>
									);
								})}
							</div>
						</section>

						{/* Main records workspace */}
						<section
							aria-labelledby="email-records"
							className="overflow-hidden rounded-2xl border border-border/80 bg-card/45 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm"
						>
							<div className="flex flex-col gap-4 border-border/80 border-b px-4 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h2 className="font-semibold text-lg" id="email-records">
											Registration emails
										</h2>
										<span className="rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground text-xs">
											1,430 total
										</span>
									</div>
									<p className="mt-1 text-muted-foreground text-sm">
										Select applicants and manage their registration messages.
									</p>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row">
									<label className="relative block sm:w-72">
										<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<input
											className="h-10 w-full rounded-lg border border-input bg-background/60 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
											placeholder="Search name, email or ID"
											type="search"
										/>
										<span className="sr-only">Search registration emails</span>
									</label>
									<Button
										className="h-10 border-border bg-background/60"
										type="button"
										variant="outline"
									>
										<SlidersHorizontal className="size-4" /> Filters
									</Button>
								</div>
							</div>

							<div className="flex gap-1 overflow-x-auto border-border/80 border-b px-4 pt-2 sm:px-6">
								{[
									"All emails",
									"Ready",
									"In progress",
									"Delivered",
									"Failed",
								].map((tab, index) => (
									<button
										className={`relative shrink-0 px-3 py-3 font-medium text-sm transition-colors ${
											index === 0
												? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
												: "text-muted-foreground hover:text-foreground"
										}`}
										key={tab}
										type="button"
									>
										{tab}
									</button>
								))}
							</div>

							{/* Desktop table */}
							<div className="hidden overflow-x-auto md:block">
								<table className="w-full min-w-[1080px] text-left text-sm">
									<thead className="bg-background/25 text-muted-foreground">
										<tr>
											<th className="w-14 px-5 py-3.5">
												<input
													aria-label="Select all records"
													className="size-4 accent-primary"
													type="checkbox"
												/>
											</th>
											{[
												"Registration",
												"Recipient",
												"Award category",
												"Status",
												"Attempts",
												"Last activity",
												"",
											].map((label) => (
												<th
													className="whitespace-nowrap px-4 py-3.5 font-medium text-xs uppercase tracking-wider"
													key={label || "actions"}
												>
													{label}
												</th>
											))}
										</tr>
									</thead>
									<tbody className="divide-y divide-border/70">
										{emailRecords.map((record) => (
											<tr
												className="transition-colors hover:bg-muted/15"
												key={record.id}
											>
												<td className="px-5 py-4">
													<input
														aria-label={`Select ${record.id}`}
														className="size-4 accent-primary"
														type="checkbox"
													/>
												</td>
												<td className="whitespace-nowrap px-4 py-4 font-semibold text-primary">
													{record.id}
												</td>
												<td className="px-4 py-4">
													<p className="font-medium">{record.name}</p>
													<p className="mt-0.5 text-muted-foreground text-xs">
														{record.email}
													</p>
												</td>
												<td className="max-w-60 px-4 py-4 text-muted-foreground">
													<span className="block truncate" title={record.award}>
														{record.award}
													</span>
												</td>
												<td className="px-4 py-4">
													<StatusBadge status={record.status} />
												</td>
												<td className="px-4 py-4 text-center tabular-nums">
													{record.attempts}
												</td>
												<td className="whitespace-nowrap px-4 py-4 text-muted-foreground text-xs">
													{record.lastSent}
												</td>
												<td className="px-5 py-4">
													<div className="flex justify-end gap-1">
														<Button
															aria-label={`Preview ${record.id}`}
															className="text-muted-foreground"
															size="icon"
															type="button"
															variant="ghost"
														>
															<Eye className="size-4" />
														</Button>
														<Button
															aria-label={`More actions for ${record.id}`}
															className="text-muted-foreground"
															size="icon"
															type="button"
															variant="ghost"
														>
															<MoreHorizontal className="size-4" />
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Compact records for phone screens */}
							<div className="divide-y divide-border/70 md:hidden">
								{emailRecords.map((record) => (
									<article className="space-y-4 p-4" key={record.id}>
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-start gap-3">
												<input
													aria-label={`Select ${record.id}`}
													className="mt-1 size-4 accent-primary"
													type="checkbox"
												/>
												<div>
													<p className="font-semibold text-primary text-sm">
														{record.id}
													</p>
													<p className="mt-1 font-medium">{record.name}</p>
													<p className="mt-0.5 break-all text-muted-foreground text-xs">
														{record.email}
													</p>
												</div>
											</div>
											<StatusBadge status={record.status} />
										</div>
										<div className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-border/70 bg-background/25 p-3 text-xs">
											<div>
												<p className="text-muted-foreground">Award category</p>
												<p className="mt-1 leading-5">{record.award}</p>
											</div>
											<div className="text-right">
												<p className="text-muted-foreground">Attempts</p>
												<p className="mt-1 font-semibold tabular-nums">
													{record.attempts}
												</p>
											</div>
										</div>
									</article>
								))}
							</div>

							<footer className="flex flex-col gap-3 border-border/80 border-t px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
								<p className="text-muted-foreground">
									Showing 1–5 of 1,430 records
								</p>
								<div className="flex items-center gap-2">
									<Button disabled size="sm" type="button" variant="outline">
										Previous
									</Button>
									<span className="px-2 text-muted-foreground text-xs">
										Page 1 of 286
									</span>
									<Button size="sm" type="button" variant="outline">
										Next <ArrowUpRight className="size-3.5 rotate-45" />
									</Button>
								</div>
							</footer>
						</section>

						{/* Static informational footer: actions are intentionally UI-only. */}
						<div className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-2 text-muted-foreground">
								<MailCheck className="size-4 text-primary" />
								<span>
									Email delivery is configured for JESA / BESA 2026
									registrations.
								</span>
							</div>
							<button
								className="flex items-center gap-1 font-medium text-primary"
								type="button"
							>
								View delivery guide{" "}
								<ChevronDown className="size-3.5 -rotate-90" />
							</button>
						</div>
					</>
				) : (
					<RegistrationLookupTab />
				)}
			</div>
		</main>
	);
}
