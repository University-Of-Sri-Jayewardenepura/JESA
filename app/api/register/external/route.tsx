import connectMongoDB from "@/lib/mongodb";
import ExternalApplicant from "@/models/externalApplicant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:Request) {
    try {
        await connectMongoDB();

        const body = await request.json();
        
        const newApplicant = new ExternalApplicant(body);
        
        await newApplicant.save();
        
        return new NextResponse(JSON.stringify({ message: "Applicant saved successfully" }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error saving applicant"}), { status: 500 });
    }
}


/* 
{
"Name": "Sonal Jayasinghe",
"Gender": "M",
 "Email": "sonaldanindulk@gmail.com",
 "Whatsapp": "0705589209",
 "University": "sri_jayewardenepura",
 "UniversityRegisterId": "AS2021939",
 "AcademicYear": "1",
 "NIC": "200105600352",
 "Award": "Best Innovator",
 "WhichIndustry": "Paka Banwa"
}
*/