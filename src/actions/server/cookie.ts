"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getAccessToken, getRefreshToken } from "../../lib/token";
import { getEnv } from "../../lib/env";
import { NODE_ENV } from "@/schemas/env";
import { ITokenUser } from "@/types/user.interface";
import { cookies } from "next/headers";

export const setCookie = async (user: ITokenUser) => {
  const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes in seconds
  const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
  const cookieStore = await cookies(); // Get cookie store

  //  Create payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  // Generate tokens
  const accessToken = getAccessToken(payload);
  const refreshToken = getRefreshToken(payload);
  const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

  // Cookie options
  const cookieData: Pick<
    ResponseCookie,
    "httpOnly" | "secure" | "sameSite" | "path"
  > = {
    httpOnly: true,
    secure: inProduction,
    sameSite: inProduction ? "none" : "lax",
    path: "/",
  };

  // Set Access Token
  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE * 1000),
    maxAge: ACCESS_TOKEN_MAX_AGE,
    ...cookieData,
  });

  // Set Refresh Token
  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
    maxAge: REFRESH_TOKEN_MAX_AGE,
    ...cookieData,
  });
};
