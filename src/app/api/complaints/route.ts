import dbConnect from "@/src/lib/mongodb";
import Complaint from "@/src/models/Complaints";
import { NextRequest, NextResponse } from "next/server";
import { sendNewComplaintEmail } from "@/src/lib/mail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { title, description, category, priority } = await req.json();

    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newComplaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      status: "Pending",
      dateSubmitted: new Date(),
    });

    await sendNewComplaintEmail({
      title,
      description,
      category,
      priority,
    });

    return NextResponse.json(
      {
        message: "Complaint registered successfully",
        complaint: newComplaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating complaint:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
