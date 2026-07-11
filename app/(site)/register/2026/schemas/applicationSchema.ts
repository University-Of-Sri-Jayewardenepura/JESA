import { z } from "zod";
import {
	FACULTY_OTHER_DEGREE,
	getFacultyConfig,
	validateFacultyDegree,
	validateFacultyEmail,
	validateFacultyRegistrationNumber,
} from "../../../../../constants/faculty-information";

/* =========================
   VALIDATION CONSTANTS
========================= */

export const SRI_LANKA_PHONE_REGEX = /^(?:0|0094|\+94)?(?:[\s-]*[1-9])(?:[\s-]*\d){8}$/;

export const formatPhoneNumber = (val: string) => {
	const cleaned = val.replace(/[\s-]/g, "");
	if (cleaned.length === 9) return `+94${cleaned}`;
	if (cleaned.length === 10 && cleaned.startsWith("0")) return `+94${cleaned.slice(1)}`;
	if (cleaned.length === 13 && cleaned.startsWith("0094")) return `+94${cleaned.slice(4)}`;
	return cleaned;
};

export const SRI_LANKA_NIC_REGEX = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;

/* =========================
   ENUMS
========================= */

const GenderEnum = z.enum(["male", "female", "other", "prefer-not-to-say"]);

const AcademicYearEnum = z.enum([
	"year-1",
	"year-2",
	"year-3",
	"year-4",
	"recent-graduate",
]);

const AwardEnum = z.enum([
	"best-leader",
	"best-team-player",
	"best-creative-designer",
	"best-communicator",
	"best-innovator",
	"best-young-entrepreneur",
	"best-csr",
	"besa-inter-university",
	"besa-fhss",
	"besa-fas",
	"besa-fmsc",
	"besa-fms",
	"besa-fot",
	"besa-foe",
	"besa-fahs",
	"besa-fuab",
	"besa-fds",
	"besa-foc",
]);

const BESA_AWARD_BY_FACULTY: Record<string, z.infer<typeof AwardEnum>> = {
	FAHS: "besa-fahs",
	FAS: "besa-fas",
	FDS: "besa-fds",
	FHSS: "besa-fhss",
	FMS: "besa-fms",
	FMSC: "besa-fmsc",
	FOC: "besa-foc",
	FOE: "besa-foe",
	FOT: "besa-fot",
	FUAB: "besa-fuab",
};

/* =========================
   PERSONAL INFO
========================= */

const personalInfoSchema = z.object({
	publicDisplayName: z.string().min(1, "Name is required"),

	nic: z
		.string()
		.min(1, "NIC is required")
		.regex(
			SRI_LANKA_NIC_REGEX,
			"NIC must be 9 digits followed by V/X or 12 digits",
		),

	gender: GenderEnum,

	email: z.string().email("Invalid email format"),

	whatsappNumber: z
		.string()
		.min(1, "WhatsApp number is required")
		.refine(
			(val) => SRI_LANKA_PHONE_REGEX.test(val),
			"Enter a valid Sri Lankan number",
		)
		.transform(formatPhoneNumber),

	mobileNumber: z
		.string()
		.min(1, "Mobile number is required")
		.refine(
			(val) => SRI_LANKA_PHONE_REGEX.test(val),
			"Enter a valid Sri Lankan number",
		)
		.transform(formatPhoneNumber),
});

/* =========================
   ACADEMIC INFO
========================= */

const USJ_UNIVERSITY = "University of Sri Jayewardenepura";

const academicInfoSchema = z
	.object({
		university: z.string().min(1, "University is required"),

		universityRegistrationNumber: z
			.string()
			.min(1, "Registration number is required"),

		universityEmail: z.string().email("Invalid university email"),

		academicYear: AcademicYearEnum,

		faculty: z.string().min(1, "Faculty is required"),

		degree: z.string().min(1, "Degree is required"),

		otherDegree: z.string().optional(),

		graduationYear: z
			.string()
			.regex(
				/^(2023|2024|2025|2026)$/,
				"Graduation year must be between 2023 and 2026",
			)
			.optional(),
	})
	.superRefine((academicInfo, context) => {
		if (academicInfo.university !== USJ_UNIVERSITY) return;

		const facultyConfig = getFacultyConfig(academicInfo.faculty);

		if (!facultyConfig) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Select a valid USJ faculty",
				path: ["faculty"],
			});
			return;
		}

		if (
			!validateFacultyRegistrationNumber(
				academicInfo.faculty,
				academicInfo.universityRegistrationNumber,
			)
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: facultyConfig.registration.description,
				path: ["universityRegistrationNumber"],
			});
		}

		if (
			!validateFacultyEmail(academicInfo.faculty, academicInfo.universityEmail)
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: `University email must use ${facultyConfig.email.suffix}`,
				path: ["universityEmail"],
			});
		}

		if (
			!validateFacultyDegree(
				academicInfo.faculty,
				academicInfo.degree,
				academicInfo.otherDegree,
			)
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					academicInfo.degree === FACULTY_OTHER_DEGREE
						? "Other degree is required"
						: "Select a degree offered by the selected faculty",
				path: [
					academicInfo.degree === FACULTY_OTHER_DEGREE
						? "otherDegree"
						: "degree",
				],
			});
		}
	});

/* =========================
   AWARD SELECTION
========================= */

const awardSelectionSchema = z.object({
	selectedAwards: z
		.array(AwardEnum)
		.min(1, "At least one award must be selected"),

	hasConditionalAwards: z.boolean(),
});

/* =========================
   QUESTIONS
========================= */

const bestInnovatorSchema = z
	.object({
		industry: z.string().min(1).optional(),
		innovationCompletionPercentage: z.boolean().optional(),
		otherIndustry: z.string().optional(),
	})
	.optional();

const bestCSRSchema = z
	.object({
		clubAdvisorNameTitle: z.string().min(1).optional(),
		clubAdvisorEmail: z.string().email().optional(),
		memberAttendingName: z.string().optional(),
		memberAttendingWhatsapp: z
			.string()
			.regex(SRI_LANKA_PHONE_REGEX, "Enter a valid Sri Lankan number")
			.transform(formatPhoneNumber)
			.optional(),
		clubPresidentName: z.string().optional(),
		clubPresidentWhatsapp: z
			.string()
			.regex(SRI_LANKA_PHONE_REGEX, "Enter a valid Sri Lankan number")
			.transform(formatPhoneNumber)
			.optional(),
		clubPresidentEmail: z.string().email().optional(),
	})
	.optional();

/* =========================
   DECLARATION
========================= */

const declarationSchema = z.object({
	confirmAccuracy: z.literal(true, {
		errorMap: () => ({ message: "You must confirm accuracy" }),
	}),
	agreeDisqualification: z.literal(true, {
		errorMap: () => ({ message: "You must agree to disqualification terms" }),
	}),
	agreePhysicalInterview: z.literal(true, {
		errorMap: () => ({
			message: "You must agree to physical interview attendance",
		}),
	}),
	permitVerification: z.literal(true, {
		errorMap: () => ({ message: "You must permit verification" }),
	}),
	consentPublicity: z.literal(true, {
		errorMap: () => ({ message: "You must consent to publicity" }),
	}),
});

/* =========================
   MAIN SCHEMA
========================= */

export const applicationSchema = z.object({
	applicantType: z.enum(["internal", "external"]),

	personalInfo: personalInfoSchema,

	academicInfo: academicInfoSchema,

	awardSelection: awardSelectionSchema,

	bestInnovatorQuestions: bestInnovatorSchema,

	bestCSRQuestions: bestCSRSchema,

	declaration: declarationSchema,
});

/* =========================
   BUSINESS RULES
========================= */

export const applicationBusinessSchema = applicationSchema
	.refine(
		(data) =>
			new Set(data.awardSelection.selectedAwards).size ===
			data.awardSelection.selectedAwards.length,
		{
			message: "You cannot select duplicate awards",
			path: ["awardSelection.selectedAwards"],
		},
	)

	.refine(
		(data) => {
			const isUSJ = data.academicInfo.university === USJ_UNIVERSITY;

			if (isUSJ) return true;

			return data.awardSelection.selectedAwards.every(
				(a) => a === "best-innovator" || a === "besa-inter-university",
			);
		},
		{
			message:
				"Only Best Innovator and BESA Inter University are open to external universities",
			path: ["awardSelection.selectedAwards"],
		},
	)

	.refine(
		(data) => {
			if (data.academicInfo.academicYear !== "recent-graduate") return true;

			return (
				data.awardSelection.selectedAwards.length === 1 &&
				data.awardSelection.selectedAwards[0] === "best-innovator"
			);
		},
		{
			message: "Recent graduates can only apply for the Best Innovator Award",
			path: ["awardSelection.selectedAwards"],
		},
	)

	.refine(
		(data) => {
			const isUSJ = data.academicInfo.university === USJ_UNIVERSITY;

			return isUSJ
				? data.awardSelection.selectedAwards.length <= 3
				: data.awardSelection.selectedAwards.length <= 2;
		},
		{
			message: "USJ students max 3 awards, others max 2 awards",
			path: ["awardSelection.selectedAwards"],
		},
	)

	.refine(
		(data) => {
			if (!data.awardSelection.selectedAwards.includes("best-innovator"))
				return true;

			const q = data.bestInnovatorQuestions;
			const hasIndustry = q?.industry && q.industry.trim().length > 0;
			const hasCompletion = q?.innovationCompletionPercentage === true;
			return Boolean(hasIndustry && hasCompletion);
		},
		{
			message:
				"Industry and completion confirmation are required for Best Innovator",
			path: ["bestInnovatorQuestions"],
		},
	)

	.refine(
		(data) => {
			if (!data.awardSelection.selectedAwards.includes("besa-inter-university"))
				return true;

			return data.academicInfo.university.length > 0;
		},
		{
			message:
				"BESA Inter University is only for Sri Lankan state universities",
			path: ["awardSelection.selectedAwards"],
		},
	)

	.refine(
		(data) => {
			if (!data.awardSelection.selectedAwards.includes("best-csr")) return true;
			const advisor = data.bestCSRQuestions?.clubAdvisorEmail?.trim();
			const president = data.bestCSRQuestions?.clubPresidentEmail?.trim();
			if (!advisor || !president) return true;
			return advisor.toLowerCase() !== president.toLowerCase();
		},
		{
			message: "Club advisor and president emails must be different",
			path: ["bestCSRQuestions.clubPresidentEmail"],
		},
	)

	.refine(
		(data) => {
			const facultyBesaAwards = data.awardSelection.selectedAwards.filter(
				(a) => a.startsWith("besa-") && a !== "besa-inter-university",
			);

			if (facultyBesaAwards.length === 0) return true;

			const allowedAward = BESA_AWARD_BY_FACULTY[data.academicInfo.faculty];
			return Boolean(
				allowedAward &&
					facultyBesaAwards.every((award) => award === allowedAward),
			);
		},
		{
			message: "You are not eligible for selected BESA awards",
			path: ["academicInfo.faculty"],
		},
	)

	.refine(
		(data) => {
			if (data.academicInfo.academicYear !== "recent-graduate") return true;
			return (data.academicInfo.graduationYear?.trim().length ?? 0) > 0;
		},
		{
			message: "Graduation year is required for recent graduates (2023–2026)",
			path: ["academicInfo.graduationYear"],
		},
	);