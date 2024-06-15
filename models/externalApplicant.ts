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
    Award: {
      type: String,
      enum: getEnumValues(AWARDS),
      required: true,
    },
    WhichIndustry: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ExternalApplicant =
  mongoose.models.ExternalApplicant ||
  mongoose.model("ExternalApplicant", externalApplicantSchema);
export default ExternalApplicant;
