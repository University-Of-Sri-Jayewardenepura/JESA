import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import z from "zod";
import RegTable from "@/models/RegTable";

// Define schema using zod
const schema = z.object({
  Whatsapp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = schema.safeParse(body);

    // Return error response if validation fails
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    // Check if the phone number length is valid
    if (body.Whatsapp.length < 9) {
      return NextResponse.json({ message: "Please check phone number" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Find user with the given Whatsapp number
    const user = await RegTable.find({ Whatsapp: body.Whatsapp });

    // Return error response if no user is found
    if (!user) {
      return NextResponse.json({ message: "No Data Found" }, { status: 404 });
    }

    // Return success response with the user data
    return NextResponse.json({ message: "Applicant found successfully", user }, { status: 200 });

  } catch (error) {
    console.error(error);
    // Return error response for any other errors
    return NextResponse.json({ message: "Sorry! We are unable to process your request." }, { status: 500 });
  }
}

/* api example 
http://localhost:3000/api/getregno
body:-
{
    "Whatsapp":"707418777"
}

replay example:-
{
    "message": "Applicant found successfully",
    "user": {
        "_id": "66a67c08d935c7fdb307a8d1",
        "Name": "Yevindi Uthara ",
        "Email": "yevindi2001@gamil.com",
        "Whatsapp": "707418777",
        "RegNo": "TP001"
    }
}
*/