export interface Application {
	id: string;
	applicantType?: "internal" | "external";
	personalInfo?: {
		publicDisplayName?: string;
		email?: string;
		whatsappNumber?: string;
		mobileNumber?: string;
		gender?: string;
		nic?: string;
	};
	academicInfo?: {
		university?: string;
		universityRegistrationNumber?: string;
		universityEmail?: string;
		academicYear?: string;
		faculty?: string;
		degree?: string;
		graduationYear?: string;
	};
	awardSelection?: {
		selectedAwards?: string[];
		hasConditionalAwards?: boolean;
	};
	bestInnovatorQuestions?: {
		industry?: string;
		otherIndustry?: string;
		innovationCompletionPercentage?: boolean;
	};
	bestCSRQuestions?: {
		clubAdvisorNameTitle?: string;
		clubAdvisorEmail?: string;
		memberAttendingName?: string;
		memberAttendingWhatsapp?: string;
		clubPresidentName?: string;
		clubPresidentWhatsapp?: string;
		clubPresidentEmail?: string;
	};
	status?: ApplicationStatus;
	submittedAt?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export type ApplicationStatus =
	| "submitted"
	| "shortlisted"
	| "approved"
	| "rejected";

export interface DashboardFilters {
	search: string;
	type: "all" | "internal" | "external";
	category: "all" | "jesa" | "besa";
	award: string;
	university: string;
	faculty: string;
	academicYear: string;
	gender: string;
	status: ApplicationStatus | "all";
	dateFrom: string;
	dateTo: string;
}
