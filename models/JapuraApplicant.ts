import mongoose,{Schema} from "mongoose";
import {ACADEMICYEAR} from '../app/constants/index';

const japuraApplicantSchema = new Schema(
    {
        ApplicantId:{
            type:'ObjectID',
            required: true,
        },
        UniversityID:{
            type:String,
            required: true,
        },
        AcademicYear:{
            type:String,
            enum:[ACADEMICYEAR.Year1,ACADEMICYEAR.Year2,ACADEMICYEAR.Year3,ACADEMICYEAR.Year4],
            required: true,
        },
        isPastParticipant:{
            type:Boolean,
            required: true,
        },
        award1:{
            type:String,
            required: true,
        },
        award2:{
            type:String
        },
        award3:{
            type:String
        },
    }
)

const JapuraApplicant = mongoose.models.JapuraApplicant || mongoose.model("JapuraApplicant",japuraApplicantSchema)