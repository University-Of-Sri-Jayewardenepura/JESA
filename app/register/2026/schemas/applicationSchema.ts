import { z } from "zod";

/* =========================
   VALIDATION CONSTANTS
========================= */

export const SRI_LANKA_PHONE_REGEX = /^\+94(?:[1-9]\d{8}|\d{7})$/;

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
]);

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
      "NIC must be 9 digits followed by V/X or 12 digits"
    ),

  gender: GenderEnum,

  email: z.string().email("Invalid email format"),

  whatsappNumber: z
    .string()
    .min(1, "WhatsApp number is required")
    .refine(
      (val) => SRI_LANKA_PHONE_REGEX.test(val),
      "Enter a valid Sri Lankan number (+94 7X XXX XXXX)"
    )
    .transform((val) => val.replace(/\s/g, "")),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .refine(
      (val) => SRI_LANKA_PHONE_REGEX.test(val),
      "Enter a valid Sri Lankan number (+94 7X XXX XXXX)"
    )
    .transform((val) => val.replace(/\s/g, "")),
});

/* =========================
   ACADEMIC INFO
========================= */

const academicInfoSchema = z.object({
  university: z.string().min(1, "University is required"),

  universityRegistrationNumber: z
    .string()
    .min(1, "Registration number is required"),

  universityEmail: z.string().email("Invalid university email"),

  academicYear: AcademicYearEnum,

  faculty: z.string().min(1, "Faculty is required"),

  degree: z.string().min(1, "Degree is required"),

  otherDegree: z.string().optional(),

  graduationYear: z.string().optional(),
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
      .optional(),
    clubPresidentName: z.string().optional(),
    clubPresidentWhatsapp: z
      .string()
      .regex(SRI_LANKA_PHONE_REGEX, "Enter a valid Sri Lankan number")
      .optional(),
    clubPresidentEmail: z.string().email().optional(),
  })
  .optional();

/* =========================
   DECLARATION
========================= */

const declarationSchema = z.object({
  confirmAccuracy: z.boolean(),
  agreeDisqualification: z.boolean(),
  agreePhysicalInterview: z.boolean(),
  permitVerification: z.boolean(),
  consentPublicity: z.boolean(),
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
    }
  )

  .refine(
    (data) => {
      const isUSJ =
        data.academicInfo.university ===
        "University of Sri Jayewardenepura";

      if (isUSJ) return true;

      return data.awardSelection.selectedAwards.every(
        (a) =>
          a === "best-innovator" || a === "besa-inter-university"
      );
    },
    {
      message:
        "Only Best Innovator and BESA Inter University are open to external universities",
      path: ["awardSelection.selectedAwards"],
    }
  )

  .refine(
    (data) => {
      if (data.academicInfo.academicYear !== "recent-graduate")
        return true;

      return (
        data.awardSelection.selectedAwards.length === 1 &&
        data.awardSelection.selectedAwards[0] === "best-innovator"
      );
    },
    {
      message:
        "Recent graduates can only apply for the Best Innovator Award",
      path: ["awardSelection.selectedAwards"],
    }
  )

  .refine(
    (data) => {
      const isUSJ =
        data.academicInfo.university ===
        "University of Sri Jayewardenepura";

      return isUSJ
        ? data.awardSelection.selectedAwards.length <= 3
        : data.awardSelection.selectedAwards.length <= 2;
    },
    {
      message:
        "USJ students max 3 awards, others max 2 awards",
      path: ["awardSelection.selectedAwards"],
    }
  )

  .refine(
    (data) => {
      if (!data.awardSelection.selectedAwards.includes("best-innovator"))
        return true;

      return data.bestInnovatorQuestions?.innovationCompletionPercentage === true;
    },
    {
      message: "Invalid Best Innovator submission",
      path: ["bestInnovatorQuestions"],
    }
  )

  .refine(
    (data) => {
      if (
        !data.awardSelection.selectedAwards.includes("besa-inter-university")
      )
        return true;

      return data.academicInfo.university.length > 0;
    },
    {
      message:
        "BESA Inter University is only for Sri Lankan state universities",
      path: ["awardSelection.selectedAwards"],
    }
  )

  .refine(
    (data) => {
      const facultyBesaAwards = data.awardSelection.selectedAwards.filter(
        (a) => a.startsWith("besa-") && a !== "besa-inter-university"
      );

      if (facultyBesaAwards.length === 0) return true;

      const allowed = [
        "FOT",
        "FAS",
        "FOE",
        "FMSC",
        "FMS",
        "FAHS",
        "FHSS",
        "FUAB",
        "FDS",
      ];

      return allowed.includes(data.academicInfo.faculty);
    },
    {
      message: "You are not eligible for selected BESA awards",
      path: ["academicInfo.faculty"],
    }
  );
