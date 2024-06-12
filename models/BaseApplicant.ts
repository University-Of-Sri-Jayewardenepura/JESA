import mongoose,{Schema} from "mongoose";
import {GENDER,UNIVERSITY} from '../app/constants/index';

const applicantSchema = new Schema(
    {
        Name:{
            type:String,
            required: true,
        },
        Gender:{
            type:String,
            enum:[GENDER.FEMALE,GENDER.MALE],
            required: true,
        },
        Email:{
            type:String,
            required: true,
        },
        Whatsapp:{
            type:Number,
            required: true,
        },
        University:{
            type:String,
            enum:[UNIVERSITY.INTERUNIVERSITY,UNIVERSITY.JAYAWARDANAPURA],
            required: true,
        },
    }
)

const applicant = mongoose.models.Applicant || mongoose.model("Applicant",applicantSchema)