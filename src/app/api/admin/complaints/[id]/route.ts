import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/src/lib/mongodb";
import Complaint from "@/src/models/Complaints";
import { sendStatusUpdateEmail } from "@/src/lib/mail";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest) {
  try {
    const { status } = await req.json();

    if (!["Pending", "In progress", "Resolved"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Extract id from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    try {
      await sendStatusUpdateEmail({
        title: complaint.title,
        status: complaint.status,
      });
    } catch (err) {
      console.error("Status email failed:", err);
    }

    return NextResponse.json({
      message: "Status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const cookiestore = await cookies();
    const token = cookiestore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET!
    ) as { role?: string };

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Extract id from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const complaint = await Complaint.findById(id).lean();

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ complaint });
  } catch (error) {
    console.error("Fetch complaint error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
