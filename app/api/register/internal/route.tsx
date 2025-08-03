import connectMongoDB from "@/lib/mongodb";
import InternalApplicant from "@/models/internalApplicant";
import BaseApplicant from "@/models/BaseApplicant";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { AWARDS } from "@/constants/form";

// Add a simple GET method for testing
export async function GET() {
  return NextResponse.json({ message: "Internal registration API is working" });
}

const internalApplicantSchema = z
  .object({
    Name: z.string().min(1, "Name is required"),
    Gender: z.enum(["Male", "Female", "Other"]),
    Email: z.string().email("Invalid email format"),
    Whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
    University: z.string().min(1, "University is required"),
    UniversityRegisterId: z.string().min(1, "Registration ID is required"),
    AcademicYear: z.string().min(1, "Academic year is required"),
    Faculty: z.string().min(1, "Faculty is required"),
    Degree: z.string().min(1, "Degree is required"),
    OtherDegree: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    Award1: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    Award2: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    Award3: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    TermsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept terms and conditions",
    }),
  })
  .refine(
    (data) => {
      // At least one award must be selected
      const awards = [data.Award1, data.Award2, data.Award3].filter(
        (award) => award && award.trim() !== ""
      );
      return awards.length >= 1;
    },
    {
      message: "At least one award must be selected",
      path: ["Award1"],
    }
  )
  .refine(
    (data) => {
      // Check for duplicate awards
      const awards = [data.Award1, data.Award2, data.Award3].filter(
        (award) => award && award.trim() !== ""
      );
      const uniqueAwards = new Set(awards);
      return uniqueAwards.size === awards.length;
    },
    {
      message: "You cannot select the same award multiple times",
      path: ["Award1"],
    }
  );

// Helper function to get valid awards for a faculty and academic year
function getValidAwardsForFaculty(
  faculty: string,
  academicYear: string
): string[] {
  const facultyToBesaAwardsMap: Record<string, string[]> = {
    "Faculty of Management Studies & Commerce": [
      AWARDS.BESA_MANAGEMENT_STUDIES_AND_COMMERCE,
    ],
    "Faculty of Applied Sciences": [AWARDS.BESA_APPLIED_SCIENCES],
    "Faculty of Humanities and Social Sciences": [
      AWARDS.BESA_HUMANITIES_AND_SOCIAL_SCIENCES,
    ],
    "Faculty of Allied Health Sciences": [AWARDS.BESA_ALLIED_HEALTH_SCIENCES],
    "Faculty of Technology": [AWARDS.BESA_TECHNOLOGY],
    "Faculty of Engineering": [AWARDS.BESA_ENGINEERING],
    "Faculty of Medical Science": [AWARDS.BESA_MEDICAL_SCIENCES],
    "Faculty of Dental Sciences": [AWARDS.BESA_DENTAL_SCIENCES],
    "Faculty of Urban & Aquatic Bio-resources": [AWARDS.BESA_URBAN_AQUATIC],
  };

  // If 5th year, they can ONLY apply for Best Innovator
  if (academicYear === "5th Year (19/20)") {
    return ["Best Innovator"];
  }

  // For all other years, they can apply for ALL awards (including Best Innovator)
  let defaultAwards = Object.values(AWARDS).filter(
    (award) => !award.startsWith("BESA")
  );

  // Get faculty-specific BESA awards (only for the selected faculty)
  const facultySpecificAwards = facultyToBesaAwardsMap[faculty] || [];

  // Combine general awards with faculty-specific BESA awards
  return [...defaultAwards, ...facultySpecificAwards];
}

export async function POST(request: NextRequest) {
  console.log("POST request received at /api/register/internal");

  try {
    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    const validity = internalApplicantSchema.safeParse(body);

    if (!validity.success) {
      console.log("Validation errors:", validity.error.errors);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validity.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const validatedData = validity.data;

    // Check university
    if (validatedData.University !== "University of Sri Jayewardenepura") {
      return NextResponse.json(
        { message: "You do not belong to this university form!" },
        { status: 401 }
      );
    }

    // Get valid awards for the selected faculty and academic year
    const validAwards = getValidAwardsForFaculty(
      validatedData.Faculty,
      validatedData.AcademicYear
    );

    // Get selected awards (filter out empty/undefined ones)
    const selectedAwards = [
      validatedData.Award1,
      validatedData.Award2,
      validatedData.Award3,
    ].filter((award) => award && award.trim() !== "");

    // Validate each selected award is valid for the faculty and academic year
    for (const award of selectedAwards) {
      if (typeof award === "string" && !validAwards.includes(award)) {
        // Special message for 5th year students trying to apply for other awards
        if (
          validatedData.AcademicYear === "5th Year (19/20)" &&
          award !== "Best Innovator"
        ) {
          return NextResponse.json(
            {
              message:
                "5th year students can only apply for the Best Innovator award",
            },
            { status: 401 }
          );
        }
        return NextResponse.json(
          {
            message: `Award "${award}" is not available for your faculty or academic year`,
          },
          { status: 401 }
        );
      }
    }

    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("MongoDB connected successfully");

    // Check for duplicate email
    const duplicateCheck = await InternalApplicant.findOne({
      Email: validatedData.Email,
    });

    if (duplicateCheck) {
      return NextResponse.json(
        { message: "Hmm... Email already exists" },
        { status: 409 }
      );
    }

    console.log("Creating BaseApplicant...");
    // Create BaseApplicant
    const baseApplicant = new BaseApplicant({
      University: validatedData.University,
    });
    await baseApplicant.save();
    console.log("BaseApplicant created with ID:", baseApplicant._id);

    console.log("Creating InternalApplicant...");
    // Create InternalApplicant using validated data
    const newApplicant = new InternalApplicant({
      ...validatedData,
      ApplicantId: baseApplicant._id,
    });

    const savedApplicant = await newApplicant.save();
    console.log("InternalApplicant saved with ID:", savedApplicant._id);

    // Update BaseApplicant with DetailID
    await BaseApplicant.findByIdAndUpdate(baseApplicant._id, {
      DetailID: savedApplicant._id,
    });
    console.log("BaseApplicant updated with DetailID");

    return NextResponse.json(
      { message: "Registration successful!" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: "Error saving applicant",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

/*
Example request body:
{
  "Name": "Sonal Jayasinghe",
  "Gender": "M",
  "Email": "sonaldanindulk@gmail.com",
  "Whatsapp": "0705589209",
  "University": "SRI_JAYEWARDENEPURA",
  "UniversityRegisterId": "AS2021939",
  "AcademicYear": "1",
  "Faculty": "Engineering",
  "Degree": "BSc",
  "OtherDegree": "MSc",
  "IsPastParticipant": true,
  "Award1": "Best Innovator",
  "Award2": "Best Researcher",
  "Award3": "Best Presenter"
}
*/
