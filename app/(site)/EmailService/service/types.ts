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
