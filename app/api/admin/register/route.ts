import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password, secretKey } = await req.json();

    if (!email || !password || !secretKey) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { message: "Invalid admin secret key" },
        { status: 403 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
