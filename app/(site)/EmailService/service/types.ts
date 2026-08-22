import type { AwardType } from "@/lib/awards";

export type SourceApplication = {
	applicationId: string;
	applicantType: "internal" | "external";
	recipient: {
		name: string;
		email: string;
	};
	selectedAwards: AwardType[];
};

export type UpdatedApplication = {
	applicationId: string;
	applicationReferenceNumber: string;
	awardRegistrations: Array<{
		awardCode: AwardType;
		registrationNumber: string;
		status: "active" | "removed";
	}>;
};

export type ApplicationRegistrationPair = {
	source: SourceApplication;
	updated: UpdatedApplication | null;
};

export type RegistrationLookupItem = {
	applicationId: string;
	applicationReferenceNumber: string | null;
	applicantType: "internal" | "external";
	recipient: {
		name: string;
		email: string;
	};
	isRegistered: boolean;
	awards: Array<{
		awardCode: AwardType;
		awardLabel: string;
		registrationNumber: string | null;
	}>;
	missingRegistrationCount: number;
};

export type RegistrationSourceApplication = {
	applicationId: string;
	applicantType: "internal" | "external";
	awardSelection: {
		selectedAwards: string[];
	};
	personalInfo: {
		publicDisplayName: string;
		email: string;
	};
};

export type GeneratedAwardRegistration = {
	awardCode: AwardType;
	awardLabel: string;
	registrationNumber: string;
	registrationSequence: number;
	whatsappUrl: string;
	status: "active" | "removed";
};

export type RegistrationActionResult = {
	applicationId: string;
	applicationReferenceNumber: string | null;
	status: "created" | "updated" | "skipped" | "failed";
	message: string;
	awardRegistrations: GeneratedAwardRegistration[];
};

export type RegistrationBatchResult = {
	total: number;
	created: number;
	updated: number;
	skipped: number;
	failed: number;
	results: RegistrationActionResult[];
};
