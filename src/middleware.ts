import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("admin_token")?.value;
  let isAdmin = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isAdmin = payload.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  if (isAdmin && (pathname.startsWith("/complaint/register") || pathname.startsWith("/admin/login") || pathname.startsWith("/admin/register"))) {
    return NextResponse.redirect(
      new URL("/admin/main/dashboard", req.url)
    );
  }

  if (!isAdmin && pathname.startsWith("/admin/main")) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/main/:path*",
    "/complaint/register",
  ],
};
