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

export type MessageDispatchStatus =
	| "not_sent"
	| "processing"
	| "accepted"
	| "delivered"
	| "failed"
	| "bounced"
	| "complained";

export type MessageRecord = {
	applicationId: string;
	registrationNumber: string;
	recipient: {
		name: string;
		email: string;
	};
	awards: string[];
	status: MessageDispatchStatus;
	sendCount: number;
	lastSentAt: string | null;
	updatedAt: string | null;
};

export type UpdatedApplicationMessageDocument = {
	documentId: string;
	data: FirebaseFirestore.DocumentData;
};
