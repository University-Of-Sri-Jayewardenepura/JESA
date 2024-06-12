import mongoose,{Schema} from "mongoose";


import { ACADEMICYEAR,AWARDS,GENDER, UNIVERSITY } from '../app/constants/index';
import { getEnumValues } from '../app/utils/utils';


const externalApplicantSchema = new Schema(
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
        NIC: {
            type: String,
            required: true,
        },
        WhichIndustry: {
            type: String,
            required: true,
        },
        award:{
            type:String,
            enum: getEnumValues(AWARDS),
            required: true,
        },
        
    }
)

const IntreApplicant = mongoose.models.ExternalApplicant || mongoose.model("ExternalApplicant",externalApplicantSchema)