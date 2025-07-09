import connectMongoDB from "@/lib/mongodb";
import InternalApplicant from "@/models/internalApplicant";
import BaseApplicant from "@/models/BaseApplicant";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import {
  GENDER,
  UNIVERSITY,
  ACADEMICYEAR,
  FACULTY,
  DEGREE,
  AWARDS,
} from "@/constants/form";

const enumValues = <T extends Record<string, string>>(
  enumObject: T
): [string, ...string[]] => {
  const values = Object.values(enumObject);
  return [values[0], ...values.slice(1)];
};

const internalApplicantSchema = z.object({
  Name: z.string().min(1),
  Gender: z.enum(enumValues(GENDER)),
  Email: z.string().email(),
  Whatsapp: z.string(),
  University: z.enum(enumValues(UNIVERSITY)),
  UniversityRegisterId: z.string().min(1),
  AcademicYear: z.enum(enumValues(ACADEMICYEAR)),
  Faculty: z.enum(enumValues(FACULTY)),
  Degree: z.enum(enumValues(DEGREE)),
  OtherDegree: z.string().optional(),
  IsPastParticipant: z.boolean(),
  Award1: z.enum(enumValues(AWARDS)),
  Award2: z.enum(enumValues(AWARDS)).optional(),
  Award3: z.enum(enumValues(AWARDS)).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validity = internalApplicantSchema.safeParse(body);

    if (!validity.success) {
      return NextResponse.json({ error: validity.error.errors }, { status: 400 });
    }

    if (body.University !== UNIVERSITY.SRI_JAYEWARDENEPURA) {
      return NextResponse.json(
        { message: "You do not belong to this university form!" },
        { status: 401 }
      );
    }

    if (!body.IsPastParticipant && body.Award3) {
      return NextResponse.json(
        { message: "Only past participants can apply for 3 awards" },
        { status: 401 }
      );
    }

    if (body.Award1 === body.Award2 || body.Award1 === body.Award3 || (body.Award2 && body.Award2 === body.Award3)) {
      return NextResponse.json(
        { message: "You cannot select the same award more than once!" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const duplicateCheck = await InternalApplicant.findOne({ Email: body.Email });

    if (duplicateCheck) {
      return NextResponse.json({ message: "Hmm... Email already exists" }, { status: 409 });
    }

    // Create BaseApplicant
    const baseApplicant = new BaseApplicant({ University: body.University });
    await baseApplicant.save();

    // Retrieve the _id of the created BaseApplicant
    const baseApplicantId = baseApplicant._id;

    // Create InternalApplicant with BaseApplicantId
    const newApplicant = new InternalApplicant({
      ...body,
      ApplicantId: baseApplicantId, // Add BaseApplicantId to InternalApplicant
    });

    // Save the InternalApplicant
    const savedApplicant = await newApplicant.save();

    // Update the DetailID of the BaseApplicant with the _id of the saved InternalApplicant
    await BaseApplicant.findByIdAndUpdate(baseApplicantId, {
      DetailID: savedApplicant._id,
    });

    return NextResponse.json({ message: "Applicant saved successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saving applicant" },
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
