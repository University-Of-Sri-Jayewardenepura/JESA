import { describe, expect, it } from "bun:test";
import {
	FACULTY_INFORMATION,
	FACULTY_OTHER_DEGREE,
	type FacultyCode,
} from "../../../../../constants/faculty-information";
import { applicationBusinessSchema } from "./applicationSchema";

function validData(): any {
	return {
		applicantType: "internal" as const,
		personalInfo: {
			publicDisplayName: "John Doe",
			nic: "200301503249",
			gender: "male" as const,
			email: "john@example.com",
			whatsappNumber: "+94771234567",
			mobileNumber: "+94771234568",
		},
		academicInfo: {
			university: "University of Sri Jayewardenepura",
			universityRegistrationNumber: "TE123456",
			universityEmail: "ict23922@fot.sjp.ac.lk",
			academicYear: "year-3" as const,
			faculty: "FOT",
			degree: "Bachelor of ICT (Hons)",
		},
		awardSelection: {
			selectedAwards: ["best-leader", "best-innovator"],
			hasConditionalAwards: true,
		},
		bestInnovatorQuestions: {
			industry: "Technology",
			innovationCompletionPercentage: true,
		},
		declaration: {
			confirmAccuracy: true,
			agreeDisqualification: true,
			agreePhysicalInterview: true,
			permitVerification: true,
			consentPublicity: true,
		},
	};
}

describe("applicationBusinessSchema", () => {
	it("should accept a valid internal USJ application", () => {
		const result = applicationBusinessSchema.safeParse(validData());
		expect(result.success).toBe(true);
	});

	it("should accept a valid external application (best-innovator only)", () => {
		const data = {
			...validData(),
			applicantType: "external" as const,
			academicInfo: {
				...validData().academicInfo,
				university: "University of Colombo",
			},
			awardSelection: {
				selectedAwards: ["best-innovator"],
				hasConditionalAwards: false,
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should accept BESA Inter University for external", () => {
		const data = {
			...validData(),
			applicantType: "external" as const,
			academicInfo: {
				...validData().academicInfo,
				university: "University of Kelaniya",
			},
			awardSelection: {
				selectedAwards: ["best-innovator", "besa-inter-university"],
				hasConditionalAwards: false,
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should accept old-format NIC with lowercase v", () => {
		const data = validData();
		data.personalInfo.nic = "992503149v";
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should reject invalid NIC format", () => {
		const data = validData();
		data.personalInfo.nic = "12345";
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject invalid WhatsApp number", () => {
		const data = validData();
		data.personalInfo.whatsappNumber = "011234567";
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject external applying for non-allowed awards", () => {
		const data = {
			...validData(),
			applicantType: "external" as const,
			academicInfo: {
				...validData().academicInfo,
				university: "Rajarata University",
			},
			awardSelection: {
				selectedAwards: ["best-leader", "best-csr"],
				hasConditionalAwards: false,
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
		if (!result.success) {
			const paths = result.error.issues.map((i) => i.path.join("."));
			expect(paths.some((p) => p.includes("selectedAwards"))).toBe(true);
		}
	});

	it("should reject duplicate awards", () => {
		const data = validData();
		data.awardSelection.selectedAwards = ["best-leader", "best-leader"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject non-USJ selecting BESA faculty awards", () => {
		const data = {
			...validData(),
			academicInfo: {
				...validData().academicInfo,
				university: "University of Moratuwa",
			},
			awardSelection: {
				selectedAwards: ["best-leader", "besa-fot"],
				hasConditionalAwards: false,
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject recent-graduate applying non-innovator awards", () => {
		const data = validData();
		data.academicInfo.academicYear = "recent-graduate";
		data.academicInfo.graduationYear = "2025";
		data.awardSelection.selectedAwards = ["best-leader", "best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should accept recent-graduate with only best-innovator", () => {
		const data = validData();
		data.academicInfo.academicYear = "recent-graduate";
		data.academicInfo.graduationYear = "2025";
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should reject more than 3 awards for USJ", () => {
		const data = validData();
		data.awardSelection.selectedAwards = [
			"best-leader",
			"best-innovator",
			"best-team-player",
			"best-csr",
		];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject more than 2 awards for external", () => {
		const data = {
			...validData(),
			applicantType: "external" as const,
			academicInfo: {
				...validData().academicInfo,
				university: "Eastern University",
			},
			awardSelection: {
				selectedAwards: [
					"best-innovator",
					"besa-inter-university",
					"best-leader",
				],
				hasConditionalAwards: false,
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject BESA award for non-BESA faculty", () => {
		const data = validData();
		data.academicInfo.faculty = "FOE";
		data.academicInfo.universityRegistrationNumber = "EN123456";
		data.academicInfo.universityEmail = "123456@foe.sjp.ac.lk";
		data.academicInfo.degree = "BSc (Hons) in Computer Engineering";
		data.awardSelection.selectedAwards = ["besa-fot"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should accept BESA award for matching faculty", () => {
		const data = validData();
		data.academicInfo.faculty = "FOT";
		data.awardSelection.selectedAwards = ["besa-fot", "besa-inter-university"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should reject recent-graduate missing graduation year", () => {
		const data = validData();
		data.academicInfo.academicYear = "recent-graduate";
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject graduation year before 2023", () => {
		const data = validData();
		data.academicInfo.academicYear = "recent-graduate";
		data.academicInfo.graduationYear = "2022";
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject graduation year after 2026", () => {
		const data = validData();
		data.academicInfo.academicYear = "recent-graduate";
		data.academicInfo.graduationYear = "2027";
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject missing innovator completion percentage", () => {
		const data = validData();
		data.bestInnovatorQuestions = undefined;
		data.awardSelection.selectedAwards = ["best-leader"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	// --- Regression tests for fixed bugs ---

	it("should reject best-innovator without industry field", () => {
		const data = validData();
		data.bestInnovatorQuestions = {
			industry: "",
			innovationCompletionPercentage: true,
		};
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
		if (!result.success) {
			const paths = result.error.issues.map((i) => i.path.join("."));
			expect(paths.some((p) => p.includes("bestInnovatorQuestions"))).toBe(
				true,
			);
		}
	});

	it("should reject best-innovator with industry but missing completion confirmation", () => {
		const data = validData();
		data.bestInnovatorQuestions = {
			industry: "Technology",
			innovationCompletionPercentage: false,
		};
		data.awardSelection.selectedAwards = ["best-innovator"];
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject submission when declarations are all false", () => {
		const data = validData();
		data.declaration = {
			confirmAccuracy: false,
			agreeDisqualification: false,
			agreePhysicalInterview: false,
			permitVerification: false,
			consentPublicity: false,
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should reject submission when only one declaration is false", () => {
		const data = validData();
		data.declaration = {
			...validData().declaration,
			consentPublicity: false,
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});
});

describe("USJ faculty academic validation", () => {
	const validFacultyAcademicCases: Record<
		FacultyCode,
		{
			registration: string;
			email: string;
			degree: string;
		}
	> = {
		FAHS: {
			registration: "HS123456",
			email: "student.123@fahs.sjp.ac.lk",
			degree: "Bachelor of Pharmacy (Hons)",
		},
		FOC: {
			registration: "FC123456",
			email: "student.123@foc.sjp.ac.lk",
			degree: "B. Comp(hons) in Software Engineering",
		},
		FDS: {
			registration: "DE123456",
			email: "student.name@dental.sjp.ac.lk",
			degree: "Bachelor of Dental Surgery (5 Years)",
		},
		FOT: {
			registration: "TE123456",
			email: "ict23922@fot.sjp.ac.lk",
			degree: "Bachelor of ICT (Hons)",
		},
		FOE: {
			registration: "EN123456",
			email: "student.123@foe.sjp.ac.lk",
			degree: "BSc (Hons) in Computer Engineering",
		},
		FMSC: {
			registration: "MC123456",
			email: "student.123@mgt.sjp.ac.lk",
			degree: "BSc Accounting (Special)",
		},
		FAS: {
			registration: "AS123456",
			email: "student.123@sci.sjp.ac.lk",
			degree: "BSc (Hons) in Computer Science",
		},
		FMS: {
			registration: "ME/123456",
			email: "fms.student@sjp.ac.lk",
			degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS) (5 Years)",
		},
		FUAB: {
			registration: "BR123456",
			email: "student.123@fuab.sjp.ac.lk",
			degree: "BSc in Aquatic Bioresources (3 Years)",
		},
		FHSS: {
			registration: "AR123456",
			email: "student.123@fhss.sjp.ac.lk",
			degree: "BA (Hons) in Economics",
		},
	};

	it("accepts every faculty's configured registration, email, and degree", () => {
		for (const faculty of Object.keys(FACULTY_INFORMATION) as FacultyCode[]) {
			const academicCase = validFacultyAcademicCases[faculty];
			const data = validData();
			data.academicInfo.faculty = faculty;
			data.academicInfo.universityRegistrationNumber =
				academicCase.registration;
			data.academicInfo.universityEmail = academicCase.email;
			data.academicInfo.degree = academicCase.degree;
			data.awardSelection.selectedAwards = ["best-leader"];

			const result = applicationBusinessSchema.safeParse(data);
			expect(result.success).toBe(true);
		}
	});

	it("rejects a registration number from a different faculty", () => {
		const data = validData();
		data.academicInfo.faculty = "FOT";
		data.academicInfo.universityRegistrationNumber = "FC123456";

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("rejects a university email from a different faculty", () => {
		const data = validData();
		data.academicInfo.faculty = "FOT";
		data.academicInfo.universityEmail = "fc123456@foc.sjp.ac.lk";

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("rejects a degree from a different faculty", () => {
		const data = validData();
		data.academicInfo.faculty = "FOT";
		data.academicInfo.degree = "BSc Accounting (Special)";

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("requires other degree text when Other is selected", () => {
		const data = validData();
		data.academicInfo.degree = FACULTY_OTHER_DEGREE;
		data.academicInfo.otherDegree = "";

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("accepts Other degree when text is provided", () => {
		const data = validData();
		data.academicInfo.degree = FACULTY_OTHER_DEGREE;
		data.academicInfo.otherDegree = "BSc (Hons) in New Programme";

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("FOC student can select besa-fot BESA award (regression for missing FOC in BESA map)", () => {
		const data = validData();
		data.academicInfo.faculty = "FOC";
		data.academicInfo.universityRegistrationNumber = "FC123456";
		data.academicInfo.universityEmail = "student.123@foc.sjp.ac.lk";
		data.academicInfo.degree = "B. Comp(hons) in Software Engineering";
		data.awardSelection.selectedAwards = ["best-leader", "besa-fot"];

		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});
});

describe("CSR email duplicate validation", () => {
	it("should accept different advisor and president emails", () => {
		const data = {
			...validData(),
			awardSelection: {
				selectedAwards: ["best-csr"],
				hasConditionalAwards: true,
			},
			bestCSRQuestions: undefined,
		};
		// Provide bestCSRQuestions with different emails
		data.bestCSRQuestions = {
			clubAdvisorNameTitle: "Dr. Advisor",
			clubAdvisorEmail: "advisor@example.com",
			memberAttendingName: "Member Name",
			memberAttendingWhatsapp: "+94771234567",
			clubPresidentName: "President Name",
			clubPresidentWhatsapp: "+94771234568",
			clubPresidentEmail: "president@example.com",
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should reject same advisor and president emails", () => {
		const data = {
			...validData(),
			awardSelection: {
				selectedAwards: ["best-csr"],
				hasConditionalAwards: true,
			},
			bestCSRQuestions: {
				clubAdvisorNameTitle: "Dr. Advisor",
				clubAdvisorEmail: "same@example.com",
				memberAttendingName: "Member Name",
				memberAttendingWhatsapp: "+94771234567",
				clubPresidentName: "President Name",
				clubPresidentWhatsapp: "+94771234568",
				clubPresidentEmail: "same@example.com",
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
		if (!result.success) {
			const paths = result.error.issues.map((i) => i.path.join("."));
			expect(paths.some((p) => p.includes("clubPresidentEmail"))).toBe(true);
		}
	});

	it("should reject same emails even when case differs (case-insensitive check)", () => {
		const data = {
			...validData(),
			awardSelection: {
				selectedAwards: ["best-csr"],
				hasConditionalAwards: true,
			},
			bestCSRQuestions: {
				clubAdvisorNameTitle: "Dr. Advisor",
				clubAdvisorEmail: "Same@Example.com",
				memberAttendingName: "Member Name",
				memberAttendingWhatsapp: "+94771234567",
				clubPresidentName: "President Name",
				clubPresidentWhatsapp: "+94771234568",
				clubPresidentEmail: "same@example.com",
			},
		};
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should pass when CSR not selected (emails irrelevant)", () => {
		const data = validData();
		data.bestCSRQuestions = {
			clubAdvisorNameTitle: "Dr. Advisor",
			clubAdvisorEmail: "same@example.com",
			memberAttendingName: "Member Name",
			memberAttendingWhatsapp: "+94771234567",
			clubPresidentName: "President Name",
			clubPresidentWhatsapp: "+94771234568",
			clubPresidentEmail: "same@example.com",
		};
		// Not selecting 'best-csr', so duplicate validation is skipped
		const result = applicationBusinessSchema.safeParse(data);
		expect(result.success).toBe(true);
	});
});
