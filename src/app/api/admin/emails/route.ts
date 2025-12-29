import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/src/lib/mongodb";
import Admin from "@/src/models/Admin";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const admins = await Admin.find({})
      .select("email -_id")
      .lean();

    const emails = admins.map((admin) => admin.email);

    return NextResponse.json({
      emails,
      total: emails.length,
    });
  } catch (error) {
    console.error("Fetch admin emails error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
