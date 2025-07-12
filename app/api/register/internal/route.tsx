import connectMongoDB from "@/lib/mongodb";
import InternalApplicant from "@/models/internalApplicant";
import BaseApplicant from "@/models/BaseApplicant";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// Add a simple GET method for testing
export async function GET() {
  return NextResponse.json({ message: "Internal registration API is working" });
}

const internalApplicantSchema = z.object({
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
  IsPastParticipant: z.boolean(),
  Award1: z.string().min(1, "First award is required"),
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
});

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

    // Updated award validation logic
    // For non-OC members: Award3 can only be BESA Inter University if provided
    if (!validatedData.IsPastParticipant && validatedData.Award3) {
      if (validatedData.Award3 !== "BESA Inter University") {
        return NextResponse.json(
          {
            message:
              "Non-OC members can only select BESA Inter University as their third award",
          },
          { status: 401 }
        );
      }
    }

    // Check for duplicate awards
    const awards = [
      validatedData.Award1,
      validatedData.Award2,
      validatedData.Award3,
    ].filter(Boolean);
    const uniqueAwards = new Set(awards);

    if (awards.length !== uniqueAwards.size) {
      return NextResponse.json(
        { message: "You cannot select the same award more than once!" },
        { status: 401 }
      );
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
