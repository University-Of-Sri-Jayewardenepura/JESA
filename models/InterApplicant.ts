import mongoose,{Schema} from "mongoose";

const intreApplicantSchema = new Schema(
    {
        ApplicantId:{
            type:'ObjectID',
            required: true,
        },
        award:{
            type:String,
            required: true,
        },
        
    }
)

const IntreApplicant = mongoose.models.IntreApplicant || mongoose.model("IntreApplicant",intreApplicantSchema)