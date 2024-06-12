import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        await connectMongoDB();
        return NextResponse.json({message:"db connect"},{status:201});
    }catch(error){
        console.log(error)
    }
}