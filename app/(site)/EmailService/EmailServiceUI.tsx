"use client";

import {
	AlertCircle,
	ArrowUpRight,
	CheckCircle2,
	ChevronDown,
	Clock3,
	Eye,
	FileCheck2,
	Loader2,
	Mail,
	MailCheck,
	MailPlus,
	MoreHorizontal,
	Plus,
	RefreshCw,
	Search,
	Send,
	SlidersHorizontal,
	UserSearch,
	X,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getRegistrationLookup } from "./service/registration-service";
import type { RegistrationLookupItem } from "./service/types";

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

const statusStyles: Record<(typeof emailRecords)[number]["status"], string> = {
	Ready: "border-primary/25 bg-primary/10 text-primary",
	Delivered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
	Processing: "border-blue-400/25 bg-blue-500/10 text-blue-300",
	Failed: "border-red-400/25 bg-red-500/10 text-red-300",
};

/** Displays the delivery state used by the message-sending preview. */
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

/** Shows whether all required registration values exist for an application. */
function RegistrationStatusBadge({ isRegistered }: { isRegistered: boolean }) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${
				isRegistered
					? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
					: "border-primary/25 bg-primary/10 text-primary"
			}`}
		>
			<span className="size-1.5 rounded-full bg-current" />
			{isRegistered ? "Registered" : "Not registered"}
		</span>
	);
}

/** Identifies a browser request cancelled during navigation or development reload. */
function isAbortError(error: unknown) {
	return error instanceof DOMException && error.name === "AbortError";
}

/** Provides client-side search and status filtering for database lookup results. */
function RegistrationLookupTab({
	records,
	error,
	loading,
}: {
	records: RegistrationLookupItem[];
	error?: string;
	loading: boolean;
}) {
	const [search, setSearch] = useState("");
	const [registrationFilter, setRegistrationFilter] = useState<
		"all" | "registered" | "not_registered"
	>("all");
	const [selectedApplicationIds, setSelectedApplicationIds] = useState<
		string[]
	>([]);
	const [preparedApplicationIds, setPreparedApplicationIds] = useState<
		string[]
	>([]);
	const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase());
	const filteredRecords = records.filter((record) => {
		const matchesRegistrationState =
			registrationFilter === "all" ||
			(registrationFilter === "registered" && record.isRegistered) ||
			(registrationFilter === "not_registered" && !record.isRegistered);
		const matchesSearch =
			!deferredSearch ||
			[
				record.applicationReferenceNumber ?? "",
				record.recipient.name,
				record.recipient.email,
				...record.awards.flatMap((award) => [
					award.awardLabel,
					award.registrationNumber ?? "",
				]),
			].some((value) => value.toLocaleLowerCase().includes(deferredSearch));
		return matchesRegistrationState && matchesSearch;
	});
	const registeredCount = records.filter(
		(record) => record.isRegistered,
	).length;
	const selectableRecords = filteredRecords.filter(
		(record) => !record.isRegistered,
	);
	const allSelectableRecordsSelected =
		selectableRecords.length > 0 &&
		selectableRecords.every((record) =>
			selectedApplicationIds.includes(record.applicationId),
		);

	/** Adds or removes one unregistered application from the selection array. */
	function toggleApplicationSelection(applicationId: string) {
		setSelectedApplicationIds((current) =>
			current.includes(applicationId)
				? current.filter((id) => id !== applicationId)
				: [...current, applicationId],
		);
		setPreparedApplicationIds([]);
	}

	/** Selects or clears every visible unregistered application. */
	function toggleVisibleApplications() {
		const visibleIds = selectableRecords.map((record) => record.applicationId);
		setSelectedApplicationIds((current) =>
			allSelectableRecordsSelected
				? current.filter((id) => !visibleIds.includes(id))
				: [...new Set([...current, ...visibleIds])],
		);
		setPreparedApplicationIds([]);
	}

	/** Copies selected IDs into the future backend action payload without saving data. */
	function prepareRegistrationNumberAction(applicationIds: string[]) {
		setPreparedApplicationIds([...applicationIds]);
		console.log(applicationIds)
	}

	return (
		<section aria-labelledby="registration-lookup" className="space-y-4">
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
				<div className="rounded-2xl border border-border/80 bg-card/45 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
						<UserSearch className="size-5" />
					</div>
					<h2 className="mt-5 font-semibold text-xl" id="registration-lookup">
						Registration lookup
					</h2>
					<p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-6">
						Compare original applications with updated applications and verify
						whether every selected award has a registration number.
					</p>
					<label className="relative mt-5 block">
						<Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<input
							className="h-11 w-full rounded-lg border border-input bg-background/60 pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search application, applicant, email, or registration number"
							type="search"
							value={search}
						/>
						<span className="sr-only">Search registrations</span>
					</label>
				</div>

				<aside className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5">
					<div className="flex items-center justify-between">
						<span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<FileCheck2 className="size-4" />
						</span>
						<span className="text-muted-foreground text-xs">2026 intake</span>
					</div>
					<p className="mt-5 font-semibold text-3xl tabular-nums">
						{records.length}
					</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Total applications
					</p>
					<div className="mt-5 border-primary/15 border-t pt-4 text-muted-foreground text-xs">
						<span className="text-emerald-400">
							{registeredCount} registered
						</span>
						<span className="mx-2 text-border">/</span>
						{records.length - registeredCount} not registered
					</div>
				</aside>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border/80 bg-card/45 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm">
				<div className="flex flex-col gap-4 border-border/80 border-b px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-lg">
								Application registrations
							</h3>
							<span className="rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground text-xs">
								{filteredRecords.length} results
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-sm">
							Registration status is calculated from the currently selected
							awards.
						</p>
					</div>
					<label className="relative block sm:w-56">
						<select
							className="h-10 w-full appearance-none rounded-lg border border-input bg-background/60 px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
							onChange={(event) =>
								setRegistrationFilter(
									event.target.value as typeof registrationFilter,
								)
							}
							value={registrationFilter}
						>
							<option value="all">All applications</option>
							<option value="registered">Registered</option>
							<option value="not_registered">Not registered</option>
						</select>
						<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<span className="sr-only">
							Filter application registration status
						</span>
					</label>
				</div>

				{!loading && !error && selectableRecords.length > 0 && (
					<div className="flex flex-col gap-3 border-border/80 border-b bg-background/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
						<label className="flex cursor-pointer items-center gap-2 text-muted-foreground text-sm">
							<input
								aria-label="Select all visible unregistered applications"
								checked={allSelectableRecordsSelected}
								className="size-4 accent-primary"
								onChange={toggleVisibleApplications}
								type="checkbox"
							/>
							Select all unregistered in this view
						</label>
						{selectedApplicationIds.length > 0 && (
							<div className="flex flex-wrap items-center gap-2">
								<span className="mr-1 font-medium text-sm tabular-nums">
									{selectedApplicationIds.length} selected
								</span>
								<Button
									onClick={() => setSelectedApplicationIds([])}
									size="sm"
									type="button"
									variant="ghost"
								>
									Clear
								</Button>
								<Button
									onClick={() =>
										prepareRegistrationNumberAction(selectedApplicationIds)
									}
									size="sm"
									type="button"
								>
									<Plus className="size-4" /> Add Registration Numbers
								</Button>
							</div>
						)}
					</div>
				)}

				{preparedApplicationIds.length > 0 && (
					<div
						aria-live="polite"
						className="flex items-center justify-between gap-4 border-primary/20 border-b bg-primary/[0.06] px-4 py-3 sm:px-6"
					>
						<div>
							<p className="font-medium text-sm">
								{preparedApplicationIds.length} application
								{preparedApplicationIds.length === 1 ? " is" : "s are"} ready
								for registration numbers
							</p>
							<p className="mt-0.5 text-muted-foreground text-xs">
								The selected application IDs are prepared as an array. No data
								has been saved.
							</p>
						</div>
						<Button
							aria-label="Dismiss prepared selection"
							onClick={() => setPreparedApplicationIds([])}
							size="icon"
							type="button"
							variant="ghost"
						>
							<X className="size-4" />
						</Button>
					</div>
				)}

				{loading ? (
					<div className="p-10 text-center">
						<Loader2 className="mx-auto size-6 animate-spin text-primary" />
						<p className="mt-3 text-muted-foreground text-sm">
							Loading application registrations...
						</p>
					</div>
				) : error ? (
					<div className="p-8 text-center">
						<AlertCircle className="mx-auto size-6 text-red-300" />
						<p className="mt-3 font-medium">Unable to load registrations</p>
						<p className="mt-1 text-muted-foreground text-sm">{error}</p>
					</div>
				) : filteredRecords.length === 0 ? (
					<div className="p-10 text-center">
						<CheckCircle2 className="mx-auto size-7 text-emerald-400" />
						<p className="mt-3 font-medium">No matching applications</p>
						<p className="mt-1 text-muted-foreground text-sm">
							No application records match this search or filter.
						</p>
					</div>
				) : (
					<div className="divide-y divide-border/70">
						{filteredRecords.map((record) => (
							<article
								className="grid gap-5 p-4 transition-colors hover:bg-muted/10 sm:p-6 lg:grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.25fr)_auto] lg:items-center"
								key={record.applicationId}
							>
								<div className="flex items-start gap-3">
									{record.isRegistered ? (
										<span aria-hidden="true" className="mt-3 size-4 shrink-0" />
									) : (
										<input
											aria-label={`Select ${record.recipient.name}`}
											checked={selectedApplicationIds.includes(
												record.applicationId,
											)}
											className="mt-3 size-4 shrink-0 accent-primary"
											onChange={() =>
												toggleApplicationSelection(record.applicationId)
											}
											type="checkbox"
										/>
									)}
									<span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/40 font-semibold text-primary text-sm">
										{record.recipient.name
											.split(" ")
											.map((part) => part[0])
											.join("")}
									</span>
									<div className="min-w-0">
										<p className="font-semibold">{record.recipient.name}</p>
										<p className="mt-1 truncate text-muted-foreground text-xs">
											{record.recipient.email}
										</p>
										<p className="mt-1.5 font-medium text-primary text-xs">
											{record.applicationReferenceNumber ??
												"Application reference missing"}
											<span className="ml-2 font-normal text-muted-foreground capitalize">
												{record.applicantType}
											</span>
										</p>
									</div>
								</div>
								<div>
									<p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
										Selected awards
									</p>
									<ul className="space-y-2">
										{record.awards.map((award) => (
											<li
												className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2"
												key={award.awardCode}
											>
												<span
													className={
														award.registrationNumber
															? "font-semibold text-primary text-sm"
															: "font-medium text-red-300 text-xs"
													}
												>
													{award.registrationNumber ?? "Number missing"}
												</span>
												<span className="truncate text-muted-foreground text-xs">
													{award.awardLabel}
												</span>
											</li>
										))}
									</ul>
								</div>
								<div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
									<RegistrationStatusBadge isRegistered={record.isRegistered} />
									<span className="text-muted-foreground text-xs tabular-nums">
										{record.missingRegistrationCount === 0
											? "Complete"
											: `${record.missingRegistrationCount} missing`}
									</span>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

/** Renders the message and registration lookup workspaces. */
export default function EmailServiceUI() {
	const [activeWorkspace, setActiveWorkspace] = useState<
		"message-sending" | "registration-lookup"
	>("message-sending");
	const [registrationRecords, setRegistrationRecords] = useState<
		RegistrationLookupItem[]
	>([]);
	const [registrationLookupError, setRegistrationLookupError] = useState("");
	const [registrationLoading, setRegistrationLoading] = useState(false);
	const [registrationRefreshKey, setRegistrationRefreshKey] = useState(0);

	useEffect(() => {
		if (activeWorkspace !== "registration-lookup") return;

		let cancelled = false;

		/** Loads lookup records while respecting component cancellation. */
		async function loadRegistrationRecords() {
			setRegistrationLoading(true);
			setRegistrationLookupError("");
			try {
				const records = await getRegistrationLookup();
				if (!cancelled) setRegistrationRecords(records);
			} catch (error) {
				if (cancelled || isAbortError(error)) return;
				console.error("[EmailServiceUI] Failed to load registrations:", error);
				setRegistrationLookupError("Registration records could not be loaded.");
			} finally {
				if (!cancelled) setRegistrationLoading(false);
			}
		}

		void loadRegistrationRecords();

		return () => {
			cancelled = true;
		};
	}, [activeWorkspace, registrationRefreshKey]);

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
							disabled={
								activeWorkspace === "registration-lookup" && registrationLoading
							}
							onClick={() => {
								if (activeWorkspace === "registration-lookup") {
									setRegistrationRefreshKey((current) => current + 1);
								}
							}}
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
					<RegistrationLookupTab
						error={registrationLookupError}
						loading={registrationLoading}
						records={registrationRecords}
					/>
				)}
			</div>
		</main>
	);
}
