import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/token";
import { getEnv } from "@/lib/env";
import { NODE_ENV } from "@/schemas/env";
import { TokenExpiredError } from "jsonwebtoken";
import { ITokenUser } from "@/types/user.interface";

export default async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let user: ITokenUser | null = null;
  let needsRefresh = false;

  // Try to verify access token
  if (accessToken) {
    try {
      user = await verifyAccessToken(accessToken);
    } catch (error) {
      if (error instanceof TokenExpiredError && refreshToken) {
        needsRefresh = true;
      }
    }
  } else if (refreshToken) {
    needsRefresh = true;
  }

  // Handle token refresh
  if (needsRefresh && refreshToken) {
    try {
      // Verify refresh token
      const verifiedUser = await verifyRefreshToken(refreshToken);
      const newAccessToken = getAccessToken(verifiedUser);
      const newRefreshToken = getRefreshToken(verifiedUser);
      const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

      user = verifiedUser;

      const response = NextResponse.next();

      // Set new cookies
      response.cookies.set({
        name: "accessToken",
        value: newAccessToken,
        maxAge: 15 * 60,
        httpOnly: true,
        secure: inProduction,
        sameSite: inProduction ? "none" : "lax",
        path: "/",
      });

      response.cookies.set({
        name: "refreshToken",
        value: newRefreshToken,
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: inProduction,
        sameSite: inProduction ? "none" : "lax",
        path: "/",
      });

      return response;
    } catch (error: unknown) {
      console.error("Error refreshing tokens:", error);

      // Refresh token invalid - clear cookies and redirect
      const response = req.nextUrl.pathname.startsWith("/api")
        ? NextResponse.json(
            { success: false, message: "Session expired" },
            { status: 401 },
          )
        : NextResponse.redirect(new URL("/auth/signin", req.url));

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }


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
