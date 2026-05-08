import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./actions/server/isAuthenticated";

export default async function proxy(req: NextRequest) {
  const user = await isAuthenticated();

  if (!user) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to access this!",
        },
        { status: 401 },
      );
    }

    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
