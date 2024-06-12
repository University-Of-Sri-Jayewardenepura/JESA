import connectMongoDB from "@/lib/mongodb";
import InternalApplicant from "@/models/internalApplicant";
import BaseApplicant from "@/models/BaseApplicant";
import { NextRequest, NextResponse } from "next/server";
import { UNIVERSITY} from '@/app/constants/index';

export async function POST(request: Request) {
    try {
        await connectMongoDB();

        const body = await request.json();

        if(!(body.University==UNIVERSITY.SRI_JAYEWARDENEPURA)){
            return new NextResponse(JSON.stringify({ message: "You are Extenal Sudent"}), { status: 401 });            
        }
        
        // Create BaseApplicant
        const baseApplicant = new BaseApplicant({ University: body.University });
        await baseApplicant.save();

        // Retrieve the _id of the created BaseApplicant
        const baseApplicantId = baseApplicant._id;

        // Create InternalApplicant with BaseApplicantId
        const newApplicant = new InternalApplicant({
            ...body,
            ApplicantId: baseApplicantId // Add ApplicantId to InternalApplicant
        });

        // Save InternalApplicant
        await newApplicant.save();

        // Save the ExternalApplicant
        const savedApplicant = await newApplicant.save();
        
        // Update the DetilID of the BaseApplicant with the _id of the saved InternalApplicant
        await BaseApplicant.findByIdAndUpdate(baseApplicantId, { DetilID: savedApplicant._id });
        
        return new NextResponse(JSON.stringify({ message: "Applicant saved successfully" }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error saving applicant"}), { status: 500 });
    }
}
