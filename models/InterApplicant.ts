import mongoose,{Schema} from "mongoose";


import { ACADEMICYEAR,AWARDS } from '../app/constants/index';
import { getEnumValues } from '../app/utils/utils';


const intreApplicantSchema = new Schema(
    {
        ApplicantId:{
            type:'ObjectID',
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

const IntreApplicant = mongoose.models.IntreApplicant || mongoose.model("IntreApplicant",intreApplicantSchema)