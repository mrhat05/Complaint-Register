
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export async function adminMiddleware(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET as string);

        if (typeof decoded === "object" && decoded !== null && "role" in decoded) {
            const role = (decoded as JwtPayload & { role?: string }).role;
            if (role !== 'admin') {
                return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
            }
        } else {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
}