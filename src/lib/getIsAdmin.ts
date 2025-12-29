import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getIsAdmin(tokenFromMiddleware?: string) {
  let token = tokenFromMiddleware;
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("admin_token")?.value;
  }
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
  return isAdmin;
}
