import { NextRequest, NextResponse } from "next/server";
import {
  genAccessToken,
  genRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/token";
import { TokenExpiredError } from "jsonwebtoken";
import { ITokenUser } from "@/types/user.interface";
import {
  accessCookieData,
  PROTECTED_PATHS,
  refreshCookieData,
} from "@/lib/constants-server";
import { TokenType } from "@/types/token.interface";
import { Role } from "./generated/prisma/enums";

export default async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get(TokenType.ACCESS)?.value;
  const refreshToken = req.cookies.get(TokenType.REFRESH)?.value;
  const callbackUrl = encodeURIComponent(new URL(req.url).toString());
  const redirectUrl = new URL(
    `/auth/signin?callbackUrl=${callbackUrl}`,
    req.url,
  );

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

      const response = NextResponse.redirect(redirectUrl);

      // Refresh token invalid - clear cookies
      response.cookies.delete(TokenType.ACCESS);
      response.cookies.delete(TokenType.REFRESH);

      return response;
    }
  }

  // Redirect unauthenticated users to signin
  if (!user) {
    return NextResponse.redirect(redirectUrl);
  }

  if (
    PROTECTED_PATHS.ADMIN_ONLY.includes(req.nextUrl.pathname) &&
    user.role !== Role.ADMIN
  ) {
    return NextResponse.redirect(new URL("/forbidden", req.url), {
      status: 403,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
