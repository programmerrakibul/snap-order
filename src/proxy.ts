import { NextRequest, NextResponse } from "next/server";
import {
  genAccessToken,
  genRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/token";
import { TokenExpiredError } from "jsonwebtoken";
import { ITokenUser } from "@/types/user.interface";
import { accessCookieData, refreshCookieData } from "@/lib/constants-server";
import { TokenType } from "@/types/token.interface";

export default async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get(TokenType.ACCESS)?.value;
  const refreshToken = req.cookies.get(TokenType.REFRESH)?.value;

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
      const newAccessToken = genAccessToken(verifiedUser);
      const newRefreshToken = genRefreshToken(verifiedUser);

      user = verifiedUser;

      const response = NextResponse.next();

      // Set new cookies
      response.cookies.set({
        value: newAccessToken,
        ...accessCookieData,
      });

      response.cookies.set({
        value: newRefreshToken,
        ...refreshCookieData,
      });

      return response;
    } catch (error: unknown) {
      console.error("Error refreshing tokens:", error);

      // Refresh token invalid - clear cookies and redirect
      const response = NextResponse.redirect(new URL("/auth/signin", req.url));

      response.cookies.delete(TokenType.ACCESS);
      response.cookies.delete(TokenType.REFRESH);

      return response;
    }
  }

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
