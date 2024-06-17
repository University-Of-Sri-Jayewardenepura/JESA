import connectMongoDB from "@/lib/mongodb";
import ExternalApplicant from "@/models/externalApplicant";
import BaseApplicant from "@/models/BaseApplicant";
import { NextRequest, NextResponse } from "next/server";
import { UNIVERSITY, AWARDS, GENDER, ACADEMICYEAR } from "@/constants/form";
import z from "zod";

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
  Award: z.enum(enumValues(AWARDS)).default(AWARDS.BEST_INNOVATOR),
  WhichIndustry: z.string().min(1, "Industry is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    if (body.NIC.length < 8) {
      return NextResponse.json({ message: "Please check NIC number" }, { status: 401 });
    }

    if (body.University === UNIVERSITY.SRI_JAYEWARDENEPURA) {
      return NextResponse.json({
        message: "Hmm... Are you from the University of Sri Jayewardenepura?"
      }, { status: 401 });
    }

    if (body.Award !== AWARDS.BEST_INNOVATOR) {
      return NextResponse.json({
        message: "Sorry! You are only eligible for Best Innovator."
      }, { status: 401 });
    }

    await connectMongoDB();

    const duplicateCheck = await ExternalApplicant.findOne({ Email: body.Email });

    if (duplicateCheck) {
      return NextResponse.json({ message: "Hmm... Email already exists" }, { status: 409 });
    }

    // Create BaseApplicant
    const baseApplicant = new BaseApplicant({ University: body.University });
    await baseApplicant.save();

    // Retrieve the _id of the created BaseApplicant
    const baseApplicantId = baseApplicant._id;

    // Create ExternalApplicant with BaseApplicantId
    const newApplicant = new ExternalApplicant({
      ...body,
      ApplicantId: baseApplicantId, // Add BaseApplicantId to ExternalApplicant
    });

    // Save the ExternalApplicant
    const savedApplicant = await newApplicant.save();

    // Update the DetailID of the BaseApplicant with the _id of the saved ExternalApplicant
    await BaseApplicant.findByIdAndUpdate(baseApplicantId, {
      DetailID: savedApplicant._id,
    });

    return NextResponse.json({ message: "Applicant saved successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Sorry! We are unable to save your form." }, { status: 500 });
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
  "Award": "Best Innovator",
  "WhichIndustry": "Paka Banwa"
}
*/
