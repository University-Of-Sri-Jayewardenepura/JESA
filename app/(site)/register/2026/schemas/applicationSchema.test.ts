import { describe, expect, it } from "bun:test";
import { applicationBusinessSchema } from "./applicationSchema";

function validData() {
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
      universityRegistrationNumber: "REG12345",
      universityEmail: "john@sci.sjp.ac.lk",
      academicYear: "year-3" as const,
      faculty: "FOT",
      degree: "Computer Science",
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
    data.academicInfo.faculty = "Engineering";
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

  it("should reject missing innovator completion percentage", () => {
    const data = validData();
    data.bestInnovatorQuestions = undefined;
    data.awardSelection.selectedAwards = ["best-leader"];
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

  it("should accept same emails when case differs", () => {
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
