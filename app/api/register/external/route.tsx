import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { ACADEMICYEAR, AWARDS, GENDER, UNIVERSITY } from "@/constants/form";
import connectMongoDB from "@/lib/mongodb";
import BaseApplicant from "@/models/BaseApplicant";
import ExternalApplicant from "@/models/externalApplicant";

const enumValues = <T extends Record<string, string>>(
  enumObject: T
): [string, ...string[]] => {
  const values = Object.values(enumObject);
  return [values[0], ...values.slice(1)];
};

const schema = z.object({
  Name: z.string().min(1, "Name is required"),
  NIC: z.string(),
  Gender: z.enum(enumValues(GENDER)),
  Email: z.string().email("Invalid email address"),
  Whatsapp: z.string(),
  University: z.enum(enumValues(UNIVERSITY)),
  Faculty: z.string().min(1, "Faculty is required"),
  UniversityRegisterId: z.string(),
  AcademicYear: z.enum(enumValues(ACADEMICYEAR)),
  Award1: z.enum(enumValues(AWARDS)),
  Award2: z.enum(enumValues(AWARDS)).optional(),
  WhichIndustry: z.string().optional(), // Make this optional in the schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const validation = schema.safeParse(body);

    if (!validation.success) {
      console.log("Schema validation failed:", validation.error);
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    if (body.NIC.length < 8) {
      return NextResponse.json(
        { message: "Please check NIC number" },
        { status: 401 }
      );
    }

    if (body.University === UNIVERSITY.SRI_JAYEWARDENEPURA) {
      return NextResponse.json(
        {
          message: "Hmm... Are you from the University of Sri Jayewardenepura?",
        },
        { status: 401 }
      );
    }

    // Validate Award1 (required)
    if (
      body.Award1 !== AWARDS.BEST_INNOVATOR &&
      body.Award1 !== AWARDS.BESA_INTER_UNIVERSITY
    ) {
      return NextResponse.json(
        {
          message:
            "Sorry! You are only eligible for Best Innovator or BESA Inter University Award.",
        },
        { status: 401 }
      );
    }

    // Validate Award2 (optional) if provided
    if (
      body.Award2 &&
      body.Award2 !== AWARDS.BEST_INNOVATOR &&
      body.Award2 !== AWARDS.BESA_INTER_UNIVERSITY
    ) {
      return NextResponse.json(
        {
          message:
            "Sorry! You are only eligible for Best Innovator or BESA Inter University Award.",
        },
        { status: 401 }
      );
    }

    // Check if both awards are the same (if Award2 is provided)
    if (body.Award2 && body.Award1 === body.Award2) {
      return NextResponse.json(
        {
          message: "You cannot select the same award twice.",
        },
        { status: 401 }
      );
    }

    // Check if Best Innovator is selected and WhichIndustry is required
    const isBestInnovatorSelected =
      body.Award1 === AWARDS.BEST_INNOVATOR ||
      body.Award2 === AWARDS.BEST_INNOVATOR;

    if (
      isBestInnovatorSelected &&
      (!body.WhichIndustry || body.WhichIndustry.trim() === "")
    ) {
      return NextResponse.json(
        {
          message:
            "Industry information is required when applying for Best Innovator award.",
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const duplicateCheck = await ExternalApplicant.findOne({
      Email: body.Email,
    });

    if (duplicateCheck) {
      return NextResponse.json(
        { message: "Hmm... Email already exists" },
        { status: 409 }
      );
    }

    // Create BaseApplicant
    const baseApplicant = new BaseApplicant({ University: body.University });
    await baseApplicant.save();

    // Retrieve the _id of the created BaseApplicant
    const baseApplicantId = baseApplicant._id;

    // Prepare data for ExternalApplicant
    const externalApplicantData = {
      ApplicantId: baseApplicantId,
      Name: body.Name,
      NIC: body.NIC,
      Gender: body.Gender,
      Email: body.Email,
      Whatsapp: Number.parseInt(body.Whatsapp),
      University: body.University,
      Faculty: body.Faculty,
      UniversityRegisterId: body.UniversityRegisterId,
      AcademicYear: body.AcademicYear,
      Award1: body.Award1,
      WhichIndustry: undefined, // Initialize the property
    };

    // Only add Award2 if it exists and is not empty
    if (body.Award2 && body.Award2.trim() !== "") {
      externalApplicantData.Award1 = body.Award2;
    }

    // Only add WhichIndustry if Best Innovator is selected
    if (isBestInnovatorSelected && body.WhichIndustry) {
      externalApplicantData.WhichIndustry = body.WhichIndustry;
    }

    console.log("Data being saved:", externalApplicantData);

    // Create ExternalApplicant
    const newApplicant = new ExternalApplicant(externalApplicantData);

    // Save the ExternalApplicant
    const savedApplicant = await newApplicant.save();

    // Update the DetailID of the BaseApplicant
    await BaseApplicant.findByIdAndUpdate(baseApplicantId, {
      DetailID: savedApplicant._id,
    });

    return NextResponse.json(
      { message: "Applicant saved successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Full error:", error);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    return NextResponse.json(
      { message: "Sorry! We are unable to save your form." },
      { status: 500 }
    );
  }
}

/*
{
  "Name": "Sonal Jayasinghe",
  "NIC": "200105600352",
  "Gender": "M",
  "Email": "sonaldanindulk@gmail.com",
  "Whatsapp": "0705589209",
  "University": "peradeniya",
  "Faculty": "Engineering",
  "UniversityRegisterId": "AS2021939",
  "AcademicYear": "1",
  "Award1": "Best Innovator",
  "Award2": "BESA Inter University",
  "WhichIndustry": "Paka Banwa"
}
*/
