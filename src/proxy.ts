import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./actions/server/isAuthenticated";

export default async function proxy(req: NextRequest) {
  const user = await isAuthenticated();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
