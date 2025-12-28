import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export function adminMiddleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET as string);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      (decoded as JwtPayload & { role?: string }).role === "admin"
    ) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { message: "Forbidden: Admins only" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
}
