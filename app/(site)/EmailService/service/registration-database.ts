import {
	collection,
	type DocumentData,
	getDocs,
	getFirestore,
} from "firebase/firestore/lite";
import type { AwardType } from "@/lib/awards";
import { ALL_AWARD_IDS } from "@/lib/awards";
import { getFirebaseApp } from "@/lib/firebase";
import type {
	ApplicationRegistrationPair,
	SourceApplication,
	UpdatedApplication,
} from "./types";

const APPLICATIONS_COLLECTION = "applications";
const UPDATED_APPLICATIONS_COLLECTION = "updatedApplications";

/** Checks whether a database value is a supported award code. */
function isAwardType(value: unknown): value is AwardType {
	return (
		typeof value === "string" &&
		(ALL_AWARD_IDS as readonly string[]).includes(value)
	);
}

/** Returns a trimmed required string or throws for an invalid application. */
function readRequiredString(value: unknown, fieldName: string) {
	if (typeof value !== "string" || !value.trim()) {
		throw new Error(`${fieldName} is missing.`);
	}
	return value.trim();
}

/** Converts an original applications document into the fields needed by the lookup. */
function parseSourceApplication(
	documentId: string,
	data: DocumentData,
): SourceApplication {
	const personalInfo = data.personalInfo as DocumentData | undefined;
	const awardSelection = data.awardSelection as DocumentData | undefined;
	const selectedAwards = Array.isArray(awardSelection?.selectedAwards)
		? awardSelection.selectedAwards.filter(isAwardType)
		: [];

	if (selectedAwards.length === 0) {
		throw new Error("awardSelection.selectedAwards is empty or invalid.");
	}
	if (data.applicantType !== "internal" && data.applicantType !== "external") {
		throw new Error("applicantType is invalid.");
	}

	return {
		applicationId: readRequiredString(
			data.applicationId ?? documentId,
			"applicationId",
		),
		applicantType: data.applicantType,
		recipient: {
			name: readRequiredString(
				personalInfo?.publicDisplayName,
				"personalInfo.publicDisplayName",
			),
			email: readRequiredString(personalInfo?.email, "personalInfo.email"),
		},
		selectedAwards: [...new Set(selectedAwards)],
	};
}

/** Converts an updatedApplications document into comparable registration data. */
function parseUpdatedApplication(
	data: DocumentData,
): UpdatedApplication | null {
	if (typeof data.applicationId !== "string" || !data.applicationId.trim()) {
		return null;
	}
	const awardRegistrations = Array.isArray(data.awardRegistrations)
		? data.awardRegistrations.flatMap((value: unknown) => {
				if (!value || typeof value !== "object") return [];
				const award = value as DocumentData;
				if (!isAwardType(award.awardCode)) return [];
				return [
					{
						awardCode: award.awardCode,
						registrationNumber:
							typeof award.registrationNumber === "string"
								? award.registrationNumber.trim()
								: "",
						status:
							award.status === "removed"
								? ("removed" as const)
								: ("active" as const),
					},
				];
			})
		: [];

	return {
		applicationId: data.applicationId.trim(),
		applicationReferenceNumber:
			typeof data.applicationReferenceNumber === "string"
				? data.applicationReferenceNumber.trim()
				: "",
		awardRegistrations,
	};
}

/** Fetches both collections and pairs every original application by applicationId. */
export async function fetchApplicationRegistrationPairs(): Promise<
	ApplicationRegistrationPair[]
> {
	// Firestore Lite performs one-time REST reads without opening Listen streams.
	const db = getFirestore(getFirebaseApp());
	// Read sequentially so only one Firestore transport can be cancelled at a time.
	const applicationSnapshot = await getDocs(
		collection(db, APPLICATIONS_COLLECTION),
	);
	const updatedApplicationSnapshot = await getDocs(
		collection(db, UPDATED_APPLICATIONS_COLLECTION),
	);
	const updatedApplications = new Map<string, UpdatedApplication>();

	for (const document of updatedApplicationSnapshot.docs) {
		const updated = parseUpdatedApplication(document.data());
		if (updated) updatedApplications.set(updated.applicationId, updated);
	}

	const pairs: ApplicationRegistrationPair[] = [];
	for (const document of applicationSnapshot.docs) {
		try {
			const source = parseSourceApplication(document.id, document.data());
			pairs.push({
				source,
				updated: updatedApplications.get(source.applicationId) ?? null,
			});
		} catch (error) {
			console.error(
				`[RegistrationDatabase] Invalid application ${document.id}:`,
				error,
			);
		}
	}

	return pairs;
}
