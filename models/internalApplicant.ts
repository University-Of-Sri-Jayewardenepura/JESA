import mongoose,{Schema} from "mongoose";
import {GENDER,UNIVERSITY,ACADEMICYEAR,FACULTY,DEGREE,AWARDS} from '../app/constants/index';
import { getEnumValues } from '../app/utils/utils';
import exp from "constants";

const internalApplicantSchema = new Schema(
    {
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
        IsPastParticipant:{
            type:Boolean,
            required: true,
        },
        Award1:{
            type:String,
            required: true,
            enum: getEnumValues(AWARDS),
        },
        Award2:{
            type:String,
            enum: getEnumValues(AWARDS),
        },
        Award3:{
            type:String,
            enum: getEnumValues(AWARDS),
        }
    }
)

const InternalApplicant = mongoose.models.InternalApplicant || mongoose.model("InternalApplicant",internalApplicantSchema);
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