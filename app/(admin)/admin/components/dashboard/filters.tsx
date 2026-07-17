"use client";

import {
	Calendar,
	FileJson,
	FileSpreadsheet,
	Filter,
	RotateCcw,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ALL_AWARD_IDS, getAwardLabel, isBesaAward } from "@/lib/awards";
import type { Application, ApplicationStatus, DashboardFilters } from "./types";

interface FiltersProps {
	filters: DashboardFilters;
	onChange: (filters: DashboardFilters) => void;
	applications: Application[];
	onExportExcel: () => void;
	onExportJson: () => void;
}

const ACADEMIC_YEARS = [
	{ value: "year-1", label: "Year 1" },
	{ value: "year-2", label: "Year 2" },
	{ value: "year-3", label: "Year 3" },
	{ value: "year-4", label: "Year 4" },
	{ value: "recent-graduate", label: "Recent Graduate" },
];

const GENDERS = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "Female" },
	{ value: "other", label: "Other" },
	{ value: "prefer-not-to-say", label: "Prefer not to say" },
];

const STATUSES: { value: ApplicationStatus | "all"; label: string }[] = [
	{ value: "all", label: "All Statuses" },
	{ value: "submitted", label: "Submitted" },
	{ value: "shortlisted", label: "Shortlisted" },
	{ value: "approved", label: "Approved" },
	{ value: "rejected", label: "Rejected" },
];

function SelectField({
	value,
	onChange,
	options,
	placeholder,
	icon: Icon,
}: {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder: string;
	icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<div className="relative w-full">
			<Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full pl-9 h-9 bg-transparent border-input dark:bg-input/30 text-slate-200">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="max-h-[300px]">
					<SelectItem value="all">{placeholder}</SelectItem>
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export default function Filters({
	filters,
	onChange,
	applications,
	onExportExcel,
	onExportJson,
}: FiltersProps) {
	const update = (patch: Partial<DashboardFilters>) => {
		onChange({ ...filters, ...patch });
	};

	const clearFilters = () => {
		onChange({
			search: "",
			type: "all",
			category: "all",
			award: "all",
			university: "all",
			faculty: "all",
			academicYear: "all",
			gender: "all",
			status: "all",
			dateFrom: "",
			dateTo: "",
		});
	};

	const hasActiveFilters =
		filters.search ||
		filters.type !== "all" ||
		filters.category !== "all" ||
		filters.award !== "all" ||
		filters.university !== "all" ||
		filters.faculty !== "all" ||
		filters.academicYear !== "all" ||
		filters.gender !== "all" ||
		filters.status !== "all" ||
		filters.dateFrom ||
		filters.dateTo;

	const universities = Array.from(
		new Set(
			applications
				.map((a) => a.academicInfo?.university)
				.filter((u): u is string => Boolean(u)),
		),
	).sort();

	const faculties = Array.from(
		new Set(
			applications
				.map((a) => a.academicInfo?.faculty)
				.filter((f): f is string => Boolean(f)),
		),
	).sort();

	const awardOptions = ALL_AWARD_IDS.filter((award) => {
		if (filters.category === "all") return true;
		return filters.category === "besa"
			? isBesaAward(award)
			: !isBesaAward(award);
	}).map((award) => ({ value: award, label: getAwardLabel(award) }));

	return (
		<div className="space-y-4 mb-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="relative sm:col-span-2 lg:col-span-2">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
					<Input
						placeholder="Search name, email, NIC, reg no, university email..."
						value={filters.search}
						onChange={(e) => update({ search: e.target.value })}
						className="pl-9 rounded-[8px]"
					/>
				</div>

				<SelectField
					value={filters.type}
					onChange={(value) =>
						update({ type: value as DashboardFilters["type"] })
					}
					options={[
						{ value: "internal", label: "Internal" },
						{ value: "external", label: "External" },
					]}
					placeholder="All Types"
					icon={Filter}
				/>

				<SelectField
					value={filters.category}
					onChange={(value) =>
						update({
							category: value as DashboardFilters["category"],
							award: "all",
						})
					}
					options={[
						{ value: "jesa", label: "JESA Awards" },
						{ value: "besa", label: "BESA Awards" },
					]}
					placeholder="All Categories"
					icon={Filter}
				/>

				<SelectField
					value={filters.award}
					onChange={(value) => update({ award: value })}
					options={awardOptions}
					placeholder="All Awards"
					icon={AwardIcon}
				/>

				<SelectField
					value={filters.university}
					onChange={(value) => update({ university: value })}
					options={universities.map((u) => ({ value: u, label: u }))}
					placeholder="All Universities"
					icon={BuildingIcon}
				/>

				<SelectField
					value={filters.faculty}
					onChange={(value) => update({ faculty: value })}
					options={faculties.map((f) => ({ value: f, label: f }))}
					placeholder="All Faculties"
					icon={Filter}
				/>

				<SelectField
					value={filters.academicYear}
					onChange={(value) => update({ academicYear: value })}
					options={ACADEMIC_YEARS}
					placeholder="All Years"
					icon={Filter}
				/>

				<SelectField
					value={filters.gender}
					onChange={(value) => update({ gender: value })}
					options={GENDERS}
					placeholder="All Genders"
					icon={Filter}
				/>

				<SelectField
					value={filters.status}
					onChange={(value) =>
						update({ status: value as DashboardFilters["status"] })
					}
					options={STATUSES}
					placeholder="All Statuses"
					icon={Filter}
				/>

				<div className="relative">
					<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
					<Input
						type="date"
						value={filters.dateFrom}
						onChange={(e) => update({ dateFrom: e.target.value })}
						className="pl-9 rounded-[8px]"
					/>
				</div>

				<div className="relative">
					<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
					<Input
						type="date"
						value={filters.dateTo}
						onChange={(e) => update({ dateTo: e.target.value })}
						className="pl-9 rounded-[8px]"
					/>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={onExportExcel}
						variant="outline"
						className="flex-1 rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
					>
						<FileSpreadsheet className="w-4 h-4 mr-2" />
						Excel
					</Button>
					<Button
						onClick={onExportJson}
						variant="outline"
						className="flex-1 rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
					>
						<FileJson className="w-4 h-4 mr-2" />
						JSON
					</Button>
				</div>
			</div>

			{hasActiveFilters && (
				<div className="flex items-center justify-between">
					<p className="text-slate-400 text-sm">Active filters applied</p>
					<Button
						onClick={clearFilters}
						variant="ghost"
						size="sm"
						className="text-slate-400 hover:text-slate-100"
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Clear Filters
					</Button>
				</div>
			)}
		</div>
	);
}

function AwardIcon(props: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="12" cy="8" r="6" />
			<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
		</svg>
	);
}

function BuildingIcon(props: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 10h.01" />
			<path d="M12 14h.01" />
			<path d="M12 6h.01" />
			<path d="M16 10h.01" />
			<path d="M16 14h.01" />
			<path d="M16 6h.01" />
			<path d="M8 10h.01" />
			<path d="M8 14h.01" />
			<path d="M8 6h.01" />
			<path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
			<rect x="4" y="2" width="16" height="20" rx="2" />
		</svg>
	);
}
