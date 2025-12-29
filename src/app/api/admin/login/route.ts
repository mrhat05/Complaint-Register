import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/mongodb";
import Admin from "@/src/models/Admin";
import { comparePassword } from "@/src/lib/hash";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({
      message: "Login successful",
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
