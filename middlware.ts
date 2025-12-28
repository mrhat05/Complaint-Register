import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("admin_token")?.value;

  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ADMIN_JWT_SECRET!
      ) as { role?: string };

      isAdmin = decoded.role === "admin";
    } catch {
      isAdmin = false;
    }
  }


  if (isAdmin && pathname.startsWith("/complaint/register")) {
    return NextResponse.redirect(new URL("/admin/main/dashboard", req.url));
  }


  if (
    !isAdmin &&
    (pathname.startsWith("/admin/main/"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
