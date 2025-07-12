import mongoose, { Schema } from "mongoose";

import { ACADEMICYEAR, AWARDS, GENDER, UNIVERSITY } from "../constants/form";
import { getEnumValues } from "@/lib/utils";

const externalApplicantSchema = new Schema(
  {
    ApplicantId: {
      type: "ObjectId",
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    NIC: {
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
    Faculty: {
      type: String,
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
    Award1: {
      type: String,
      enum: getEnumValues(AWARDS),
      required: true,
    },
    Award2: {
      type: String,
      enum: getEnumValues(AWARDS),
    },
    WhichIndustry: {
      type: String,
      // Remove required: true to make it optional
    },
  },
  { timestamps: true }
);

// Force delete the existing model to ensure schema updates
if (mongoose.models.ExternalApplicant) {
  delete mongoose.models.ExternalApplicant;
}

const ExternalApplicant = mongoose.model(
  "ExternalApplicant",
  externalApplicantSchema
);

export default ExternalApplicant;
