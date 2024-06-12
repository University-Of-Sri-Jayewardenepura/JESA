import mongoose,{Schema} from "mongoose";
import {GENDER,UNIVERSITY,ACADEMICYEAR,FACULTY,DEGREE,AWARDS} from '../app/constants/index';
import { getEnumValues } from '../app/utils/utils';

const japuraApplicantSchema = new Schema(
    {
        ApplicantId:{
            type:'ObjectID',
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
        UniversityID: {
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
        isPastParticipant:{
            type:Boolean,
            required: true,
        },
        award1:{
            type:String,
            required: true,
            enum: getEnumValues(AWARDS),
        },
        award2:{
            type:String,
            enum: getEnumValues(AWARDS),
        },
        award3:{
            type:String,
            enum: getEnumValues(AWARDS),
        }
    }
)

const JapuraApplicant = mongoose.models.JapuraApplicant || mongoose.model("JapuraApplicant",japuraApplicantSchema)