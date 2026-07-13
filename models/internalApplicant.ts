import mongoose, { Schema } from "mongoose";
import { getEnumValues } from "@/lib/utils";
import {
	ACADEMICYEAR,
	DEGREE,
	FACULTY,
	GENDER,
	UNIVERSITY,
} from "../constants/form";

const internalApplicantSchema = new Schema(
	{
		ApplicantId: {
			type: "ObjectId",
			required: true,
		},
		Name: {
			type: String,
			required: true,
		},
		Gender: {
			type: String,
			enum: getEnumValues(GENDER),
			required: true,
		},
		Email: {
			type: String,
			required: true,
		},
		Whatsapp: {
			type: Number,
			required: true,
		},
		University: {
			type: String,
			enum: getEnumValues(UNIVERSITY),
			required: true,
		},
		UniversityRegisterId: {
			type: String,
			required: true,
		},
		AcademicYear: {
			type: String,
			enum: getEnumValues(ACADEMICYEAR),
			required: true,
		},
		Faculty: {
			type: String,
			enum: getEnumValues(FACULTY),
			required: true,
		},
		Degree: {
			type: String,
			enum: getEnumValues(DEGREE),
			required: true,
		},
		OtherDegree: {
			type: String,
		},
		Award1: {
			type: String,
			required: false,
		},
		Award2: {
			type: String,
			required: false,
		},
		Award3: {
			type: String, // Still stored as string in DB ("BESA - Inter University Award" or undefined)
			required: false,
		},
	},
	{ timestamps: true },
);

// Force delete the existing model to ensure schema updates
if (mongoose.models.InternalApplicant) {
	delete mongoose.models.InternalApplicant;
}

const InternalApplicant = mongoose.model(
	"InternalApplicant",
	internalApplicantSchema,
);

export default InternalApplicant;

/*
{
"Name": "Sonal Jayasinghe",
"Gender": "M",
 "Email": "sonaldanindulk@gmail.com",
 "Whatsapp": "0705589209",
 "University": "colombo",
 "UniversityRegisterId": "AS2021939",
 "AcademicYear": "1",
 "Faculty": "Applied Sciences",
 "Degree" : "B.A. Sinhala (Special) Degree",
 "IsPastParticipant": true,
 "Award1": "Best Innovator",
 "Award2": "Best Innovator",
 "Award3": "Best Innovator"
}
*/
