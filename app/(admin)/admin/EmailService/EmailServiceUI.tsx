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
	UserSearch,
	X,
} from "lucide-react";
import { useDeferredValue, useEffect, useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { getMessageRecords } from "./service/message-retrieval-service";
import { registerApplications } from "./service/register-applications";
import { getRegistrationLookup } from "./service/registration-service";
import { sendRegistrationEmails } from "./service/send-registration-emails";
import type {
	MessageDispatchStatus,
	MessageRecord,
	RegistrationBatchResult,
	RegistrationLookupItem,
} from "./service/types";

type MessageStatusFilter =
	| "all"
	| "not_sent"
	| "in_progress"
	| "sent"
	| "delivered"
	| "failed";

const MESSAGE_STATUS_LABELS: Record<MessageDispatchStatus, string> = {
	not_sent: "Not sent",
	processing: "Processing",
	accepted: "Sent",
	delivered: "Delivered",
	failed: "Failed",
	bounced: "Bounced",
	complained: "Complained",
};

const MESSAGE_STATUS_STYLES: Record<MessageDispatchStatus, string> = {
	not_sent: "border-primary/25 bg-primary/10 text-primary",
	processing: "border-blue-400/25 bg-blue-500/10 text-blue-300",
	accepted: "border-blue-400/25 bg-blue-500/10 text-blue-300",
	delivered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
	failed: "border-red-400/25 bg-red-500/10 text-red-300",
	bounced: "border-red-400/25 bg-red-500/10 text-red-300",
	complained: "border-red-400/25 bg-red-500/10 text-red-300",
};

/** Groups backend dispatch statuses into the visible message tabs. */
function matchesMessageFilter(
	status: MessageDispatchStatus,
	filter: MessageStatusFilter,
) {
	if (filter === "all") return true;
	if (filter === "in_progress") return status === "processing";
	if (filter === "sent") return status === "accepted";
	if (filter === "failed") {
		return (
			status === "failed" || status === "bounced" || status === "complained"
		);
	}
	return status === filter;
}

/** Allows initial sends and explicit retries while preventing duplicate delivery. */
function canSendMessage(status: MessageDispatchStatus) {
	return status === "not_sent" || status === "failed";
}

/** Formats a serialized Firestore date for the message table. */
function formatMessageDate(value: string | null) {
	if (!value) return "Not sent yet";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Unknown";
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

/** Displays the delivery state used by the message-sending preview. */
function StatusBadge({ status }: { status: MessageDispatchStatus }) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${MESSAGE_STATUS_STYLES[status]}`}
		>
			<span className="size-1.5 rounded-full bg-current" />
			{MESSAGE_STATUS_LABELS[status]}
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
	onRegistrationsChanged,
}: {
	records: RegistrationLookupItem[];
	error?: string;
	loading: boolean;
	onRegistrationsChanged: () => void;
}) {
	const [search, setSearch] = useState("");
	const [registrationFilter, setRegistrationFilter] = useState<
		"all" | "registered" | "not_registered"
	>("not_registered");
	const [registrationSort, setRegistrationSort] = useState<"asc" | "desc">(
		"asc",
	);
	const [selectedApplicationIds, setSelectedApplicationIds] = useState<
		string[]
	>([]);
	const [registrationResult, setRegistrationResult] =
		useState<RegistrationBatchResult | null>(null);
	const [registrationActionError, setRegistrationActionError] = useState("");
	const [isRegistering, startRegistrationTransition] = useTransition();
	const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase());
	const filteredRecords = records
		.filter((record) => {
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
		})
		.sort((left, right) => {
			const leftValue = left.applicationReferenceNumber ?? left.recipient.name;
			const rightValue =
				right.applicationReferenceNumber ?? right.recipient.name;
			const comparison = leftValue.localeCompare(rightValue, undefined, {
				numeric: true,
			});
			return registrationSort === "asc" ? comparison : -comparison;
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
		setRegistrationResult(null);
		setRegistrationActionError("");
	}

	/** Selects or clears every visible unregistered application. */
	function toggleVisibleApplications() {
		const visibleIds = selectableRecords.map((record) => record.applicationId);
		setSelectedApplicationIds((current) =>
			allSelectableRecordsSelected
				? current.filter((id) => !visibleIds.includes(id))
				: [...new Set([...current, ...visibleIds])],
		);
		setRegistrationResult(null);
		setRegistrationActionError("");
	}

	/** Sends a copied application ID array to the registration server action. */
	function submitRegistrationNumberAction(applicationIds: string[]) {
		const selectedIds = [...applicationIds];
		setRegistrationResult(null);
		setRegistrationActionError("");
		startRegistrationTransition(async () => {
			const notificationId = toast.loading(
				`Adding registration numbers for ${selectedIds.length} application${selectedIds.length === 1 ? "" : "s"}...`,
			);
			try {
				const result = await registerApplications(selectedIds);
				setRegistrationResult(result);
				const successful = result.created + result.updated + result.skipped;
				const summary = `${result.created} created, ${result.updated} updated, ${result.skipped} skipped`;
				if (result.failed > 0) {
					toast.error(
						`${summary}. ${result.failed} failed${successful === 0 ? "." : "; review the result below."}`,
						{ id: notificationId, duration: 7000 },
					);
				} else {
					toast.success(summary, { id: notificationId });
				}
				if (result.created > 0 || result.updated > 0) {
					setSelectedApplicationIds([]);
					onRegistrationsChanged();
				}
			} catch (actionError) {
				console.error(
					"[RegistrationLookupTab] Registration action failed:",
					actionError,
				);
				setRegistrationActionError(
					actionError instanceof Error
						? actionError.message
						: "Registration numbers could not be added.",
				);
				toast.error(
					actionError instanceof Error
						? actionError.message
						: "Registration numbers could not be added.",
					{ id: notificationId, duration: 7000 },
				);
			}
		});
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
					<div className="flex flex-col gap-2 sm:flex-row">
						<label className="relative block sm:w-48">
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
						<label className="relative block sm:w-44">
							<select
								className="h-10 w-full appearance-none rounded-lg border border-input bg-background/60 px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
								onChange={(event) =>
									setRegistrationSort(
										event.target.value as typeof registrationSort,
									)
								}
								value={registrationSort}
							>
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
							<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<span className="sr-only">Sort registrations</span>
						</label>
					</div>
				</div>

				{!loading && !error && selectableRecords.length > 0 && (
					<div className="flex flex-col gap-3 border-border/80 border-b bg-background/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
						<label className="flex cursor-pointer items-center gap-2 text-muted-foreground text-sm">
							<input
								aria-label="Select all visible unregistered applications"
								checked={allSelectableRecordsSelected}
								className="size-4 accent-primary"
								disabled={isRegistering}
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
									disabled={isRegistering}
									onClick={() => {
										setSelectedApplicationIds([]);
										setRegistrationResult(null);
										setRegistrationActionError("");
									}}
									size="sm"
									type="button"
									variant="ghost"
								>
									Clear
								</Button>
								<Button
									disabled={isRegistering}
									onClick={() =>
										submitRegistrationNumberAction(selectedApplicationIds)
									}
									size="sm"
									type="button"
								>
									{isRegistering ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Plus className="size-4" />
									)}
									{isRegistering ? "Adding..." : "Add Registration Numbers"}
								</Button>
							</div>
						)}
					</div>
				)}

				{(registrationResult || registrationActionError) && (
					<div
						aria-live="polite"
						className={`flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 ${
							registrationActionError || registrationResult?.failed
								? "border-red-400/20 bg-red-500/[0.06]"
								: "border-emerald-500/20 bg-emerald-500/[0.06]"
						}`}
					>
						<div>
							<p className="font-medium text-sm">
								{registrationActionError
									? "Registration action failed"
									: `${registrationResult?.created ?? 0} created, ${registrationResult?.updated ?? 0} updated, ${registrationResult?.skipped ?? 0} skipped`}
							</p>
							<p className="mt-0.5 text-muted-foreground text-xs">
								{registrationActionError ||
									`${registrationResult?.failed ?? 0} failed out of ${registrationResult?.total ?? 0} selected applications.`}
							</p>
						</div>
						<Button
							aria-label="Dismiss registration result"
							onClick={() => {
								setRegistrationResult(null);
								setRegistrationActionError("");
							}}
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
											disabled={isRegistering}
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
	const [messageRecords, setMessageRecords] = useState<MessageRecord[]>([]);
	const [messageError, setMessageError] = useState("");
	const [messageLoading, setMessageLoading] = useState(false);
	const [messageRefreshKey, setMessageRefreshKey] = useState(0);
	const [messageFilter, setMessageFilter] =
		useState<MessageStatusFilter>("not_sent");
	const [messageSort, setMessageSort] = useState<"asc" | "desc">("asc");
	const [messageSearch, setMessageSearch] = useState("");
	const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
	const [isSendingMessages, startMessageTransition] = useTransition();
	const deferredMessageSearch = useDeferredValue(
		messageSearch.trim().toLocaleLowerCase(),
	);
	const filteredMessageRecords = messageRecords
		.filter((record) => {
			const matchesStatus = matchesMessageFilter(record.status, messageFilter);
			const matchesSearch =
				!deferredMessageSearch ||
				[
					record.registrationNumber,
					record.recipient.name,
					record.recipient.email,
					...record.awards,
				].some((value) =>
					value.toLocaleLowerCase().includes(deferredMessageSearch),
				);
			return matchesStatus && matchesSearch;
		})
		.sort((left, right) => {
			const comparison = left.registrationNumber.localeCompare(
				right.registrationNumber,
				undefined,
				{ numeric: true },
			);
			return messageSort === "asc" ? comparison : -comparison;
		});
	const unregisteredCount = registrationRecords.filter(
		(record) => !record.isRegistered,
	).length;
	const sendableMessageRecords = filteredMessageRecords.filter((record) =>
		canSendMessage(record.status),
	);
	const allMessagesSelected =
		sendableMessageRecords.length > 0 &&
		sendableMessageRecords.every((record) =>
			selectedMessageIds.includes(record.applicationId),
		);
	const messageSummaryCards = [
		{
			label: "Ready to send",
			value: messageRecords.filter((record) => record.status === "not_sent")
				.length,
			detail: "Registration emails",
			icon: MailPlus,
			accent: "text-primary bg-primary/10 border-primary/20",
		},
		{
			label: "In progress",
			value: messageRecords.filter(
				(record) =>
					record.status === "processing" || record.status === "accepted",
			).length,
			detail: "Processing or sent",
			icon: Clock3,
			accent: "text-blue-300 bg-blue-500/10 border-blue-400/20",
		},
		{
			label: "Delivered",
			value: messageRecords.filter((record) => record.status === "delivered")
				.length,
			detail: `${messageRecords.length > 0 ? ((messageRecords.filter((record) => record.status === "delivered").length / messageRecords.length) * 100).toFixed(1) : "0.0"}% delivery rate`,
			icon: CheckCircle2,
			accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
		},
		{
			label: "Needs attention",
			value: messageRecords.filter((record) =>
				matchesMessageFilter(record.status, "failed"),
			).length,
			detail: "Failed, bounced, or complained",
			icon: AlertCircle,
			accent: "text-red-300 bg-red-500/10 border-red-400/20",
		},
	];

	/** Adds or removes one email record from the selected message array. */
	function toggleMessageSelection(messageId: string) {
		setSelectedMessageIds((current) =>
			current.includes(messageId)
				? current.filter((id) => id !== messageId)
				: [...current, messageId],
		);
	}

	/** Selects every visible message or clears the complete selection. */
	function toggleAllMessages() {
		const visibleIds = sendableMessageRecords.map(
			(record) => record.applicationId,
		);
		setSelectedMessageIds((current) =>
			allMessagesSelected
				? current.filter((id) => !visibleIds.includes(id))
				: [...new Set([...current, ...visibleIds])],
		);
	}

	/** Sends the copied selection sequentially and refreshes dispatch statuses. */
	function sendSelectedMessages(messageIds: string[]) {
		const selectedIds = [...messageIds];
		startMessageTransition(async () => {
			const notificationId = toast.loading(
				`Sending ${selectedIds.length} registration email${selectedIds.length === 1 ? "" : "s"}...`,
			);
			try {
				const result = await sendRegistrationEmails(selectedIds);
				const summary = `${result.accepted} accepted, ${result.skipped} skipped, ${result.failed} failed`;
				if (result.failed > 0 || result.skipped > 0) {
					const firstProblem = result.results.find(
						(item) => item.status !== "accepted",
					);
					toast.error(
						`${summary}.${firstProblem ? ` ${firstProblem.applicationReferenceNumber ?? firstProblem.applicationId}: ${firstProblem.message}` : ""}`,
						{ id: notificationId, duration: 8000 },
					);
				} else {
					toast.success(summary, { id: notificationId });
				}
				setSelectedMessageIds([]);
				setMessageRefreshKey((current) => current + 1);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Registration emails could not be sent.",
					{ id: notificationId, duration: 8000 },
				);
			}
		});
	}

	useEffect(() => {
		if (activeWorkspace !== "message-sending") return;
		let cancelled = false;

		/** Loads message records from updatedApplications for the active admin. */
		async function loadMessageRecords() {
			setMessageLoading(true);
			setMessageError("");
			try {
				const records = await getMessageRecords();
				if (!cancelled) {
					setMessageRecords(records);
					setSelectedMessageIds((current) =>
						current.filter((id) =>
							records.some((record) => record.applicationId === id),
						),
					);
				}
			} catch (error) {
				if (cancelled || isAbortError(error)) return;
				console.error("[EmailServiceUI] Failed to load messages:", error);
				setMessageError("Message records could not be loaded.");
				toast.error("Message records could not be loaded.", {
					id: "message-records-error",
				});
			} finally {
				if (!cancelled) setMessageLoading(false);
			}
		}

		void loadMessageRecords();
		return () => {
			cancelled = true;
		};
	}, [activeWorkspace, messageRefreshKey]);

	useEffect(() => {
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
				toast.error("Registration records could not be loaded.", {
					id: "registration-lookup-error",
				});
			} finally {
				if (!cancelled) setRegistrationLoading(false);
			}
		}

		void loadRegistrationRecords();

		return () => {
			cancelled = true;
		};
	}, [registrationRefreshKey]);

	return (
		<main className="relative min-h-screen overflow-hidden bg-background px-4 pt-28 pb-20 text-foreground sm:px-6 lg:px-8">
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 5000,
					style: {
						background: "var(--popover)",
						border: "1px solid var(--border)",
						color: "var(--popover-foreground)",
					},
				}}
			/>
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
								(activeWorkspace === "registration-lookup" &&
									registrationLoading) ||
								(activeWorkspace === "message-sending" && messageLoading)
							}
							onClick={() => {
								if (activeWorkspace === "registration-lookup") {
									setRegistrationRefreshKey((current) => current + 1);
								} else {
									setMessageRefreshKey((current) => current + 1);
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
						<span className="rounded-full bg-background/20 px-2 py-0.5 text-xs tabular-nums">
							{registrationLoading ? (
								<Loader2 className="size-3 animate-spin" />
							) : (
								unregisteredCount
							)}
						</span>
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
								{messageSummaryCards.map((card) => {
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
														{card.value.toLocaleString()}
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
											{messageRecords.length.toLocaleString()} total
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
											onChange={(event) => setMessageSearch(event.target.value)}
											placeholder="Search name, email or ID"
											type="search"
											value={messageSearch}
										/>
										<span className="sr-only">Search registration emails</span>
									</label>
									<label className="relative block sm:w-44">
										<select
											className="h-10 w-full appearance-none rounded-lg border border-input bg-background/60 px-3 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
											onChange={(event) =>
												setMessageSort(event.target.value as typeof messageSort)
											}
											value={messageSort}
										>
											<option value="asc">Ascending</option>
											<option value="desc">Descending</option>
										</select>
										<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<span className="sr-only">Sort messages</span>
									</label>
								</div>
							</div>

							<div className="flex gap-1 overflow-x-auto border-border/80 border-b px-4 pt-2 sm:px-6">
								{[
									{ label: "All emails", value: "all" },
									{ label: "Not sent", value: "not_sent" },
									{ label: "In progress", value: "in_progress" },
									{ label: "Sent", value: "sent" },
									{ label: "Delivered", value: "delivered" },
									{ label: "Failed", value: "failed" },
								].map((tab) => (
									<button
										className={`relative shrink-0 px-3 py-3 font-medium text-sm transition-colors ${
											messageFilter === tab.value
												? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
												: "text-muted-foreground hover:text-foreground"
										}`}
										key={tab.value}
										onClick={() =>
											setMessageFilter(tab.value as MessageStatusFilter)
										}
										type="button"
									>
										{tab.label}
									</button>
								))}
							</div>

							{selectedMessageIds.length > 0 && (
								<div className="flex flex-col gap-3 border-border/80 border-b bg-primary/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
									<p className="font-medium text-sm tabular-nums">
										{selectedMessageIds.length} message
										{selectedMessageIds.length === 1 ? "" : "s"} selected
									</p>
									<div className="flex items-center gap-2">
										<Button
											disabled={isSendingMessages}
											onClick={() => setSelectedMessageIds([])}
											size="sm"
											type="button"
											variant="ghost"
										>
											Clear
										</Button>
										<Button
											disabled={isSendingMessages}
											onClick={() => sendSelectedMessages(selectedMessageIds)}
											size="sm"
											type="button"
										>
											{isSendingMessages ? (
												<Loader2 className="size-4 animate-spin" />
											) : (
												<Send className="size-4" />
											)}
											{isSendingMessages ? "Sending..." : "Send Selected"}
										</Button>
									</div>
								</div>
							)}

							{messageLoading ? (
								<div className="p-10 text-center">
									<Loader2 className="mx-auto size-6 animate-spin text-primary" />
									<p className="mt-3 text-muted-foreground text-sm">
										Loading message records...
									</p>
								</div>
							) : messageError ? (
								<div className="p-8 text-center">
									<AlertCircle className="mx-auto size-6 text-red-300" />
									<p className="mt-3 font-medium">Unable to load messages</p>
									<p className="mt-1 text-muted-foreground text-sm">
										{messageError}
									</p>
								</div>
							) : filteredMessageRecords.length === 0 ? (
								<div className="p-10 text-center">
									<MailCheck className="mx-auto size-7 text-primary" />
									<p className="mt-3 font-medium">No matching messages</p>
									<p className="mt-1 text-muted-foreground text-sm">
										No updated application messages match this search or status.
									</p>
								</div>
							) : (
								<>
									{/* Desktop table */}
									<div className="hidden overflow-x-auto md:block">
										<table className="w-full min-w-[1080px] text-left text-sm">
											<thead className="bg-background/25 text-muted-foreground">
												<tr>
													<th className="w-14 px-5 py-3.5">
														<input
															aria-label="Select all records"
															checked={allMessagesSelected}
															className="size-4 accent-primary"
															disabled={
																isSendingMessages ||
																sendableMessageRecords.length === 0
															}
															onChange={toggleAllMessages}
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
												{filteredMessageRecords.map((record) => (
													<tr
														className={`transition-colors hover:bg-muted/15 ${selectedMessageIds.includes(record.applicationId) ? "bg-primary/[0.04]" : ""}`}
														key={record.applicationId}
													>
														<td className="px-5 py-4">
															<input
																aria-label={`Select ${record.registrationNumber}`}
																checked={selectedMessageIds.includes(
																	record.applicationId,
																)}
																className="size-4 accent-primary"
																disabled={
																	isSendingMessages ||
																	!canSendMessage(record.status)
																}
																onChange={() =>
																	toggleMessageSelection(record.applicationId)
																}
																type="checkbox"
															/>
														</td>
														<td className="whitespace-nowrap px-4 py-4 font-semibold text-primary">
															{record.registrationNumber}
														</td>
														<td className="px-4 py-4">
															<p className="font-medium">
																{record.recipient.name}
															</p>
															<p className="mt-0.5 text-muted-foreground text-xs">
																{record.recipient.email}
															</p>
														</td>
														<td className="max-w-60 px-4 py-4 text-muted-foreground">
															<span
																className="block truncate"
																title={record.awards.join(", ")}
															>
																{record.awards[0] ?? "No active awards"}
																{record.awards.length > 1
																	? ` +${record.awards.length - 1}`
																	: ""}
															</span>
														</td>
														<td className="px-4 py-4">
															<StatusBadge status={record.status} />
														</td>
														<td className="px-4 py-4 text-center tabular-nums">
															{record.sendCount}
														</td>
														<td className="whitespace-nowrap px-4 py-4 text-muted-foreground text-xs">
															{formatMessageDate(record.lastSentAt)}
														</td>
														<td className="px-5 py-4">
															<div className="flex justify-end gap-1">
																<Button
																	aria-label={`Preview ${record.registrationNumber}`}
																	className="text-muted-foreground"
																	size="icon"
																	type="button"
																	variant="ghost"
																>
																	<Eye className="size-4" />
																</Button>
																<Button
																	aria-label={`More actions for ${record.registrationNumber}`}
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
										{filteredMessageRecords.map((record) => (
											<article
												className="space-y-4 p-4"
												key={record.applicationId}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="flex items-start gap-3">
														<input
															aria-label={`Select ${record.registrationNumber}`}
															checked={selectedMessageIds.includes(
																record.applicationId,
															)}
															className="mt-1 size-4 accent-primary"
															disabled={
																isSendingMessages ||
																!canSendMessage(record.status)
															}
															onChange={() =>
																toggleMessageSelection(record.applicationId)
															}
															type="checkbox"
														/>
														<div>
															<p className="font-semibold text-primary text-sm">
																{record.registrationNumber}
															</p>
															<p className="mt-1 font-medium">
																{record.recipient.name}
															</p>
															<p className="mt-0.5 break-all text-muted-foreground text-xs">
																{record.recipient.email}
															</p>
														</div>
													</div>
													<StatusBadge status={record.status} />
												</div>
												<div className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-border/70 bg-background/25 p-3 text-xs">
													<div>
														<p className="text-muted-foreground">
															Award category
														</p>
														<p className="mt-1 leading-5">
															{record.awards.join(", ") || "No active awards"}
														</p>
													</div>
													<div className="text-right">
														<p className="text-muted-foreground">Attempts</p>
														<p className="mt-1 font-semibold tabular-nums">
															{record.sendCount}
														</p>
													</div>
												</div>
											</article>
										))}
									</div>
								</>
							)}

							<footer className="flex flex-col gap-3 border-border/80 border-t px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
								<p className="text-muted-foreground">
									Showing {filteredMessageRecords.length.toLocaleString()} of{" "}
									{messageRecords.length.toLocaleString()} records
								</p>
								<div className="flex items-center gap-2">
									<Button disabled size="sm" type="button" variant="outline">
										Previous
									</Button>
									<span className="px-2 text-muted-foreground text-xs">
										Page 1 of 1
									</span>
									<Button disabled size="sm" type="button" variant="outline">
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
						onRegistrationsChanged={() =>
							setRegistrationRefreshKey((current) => current + 1)
						}
						records={registrationRecords}
					/>
				)}
			</div>
		</main>
	);
}
