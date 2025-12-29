import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/mongodb";
import Complaint from "@/src/models/Complaints";
import { adminMiddleware } from "@/src/lib/auth/adminMiddleware";

export async function GET(req: NextRequest) {
  const authError = adminMiddleware(req);
  if (authError !== undefined) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({})
      .select("title status priority category createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Complaint.countDocuments();

    return NextResponse.json({
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin complaints fetch error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
