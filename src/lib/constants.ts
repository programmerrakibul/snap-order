import { getEnv } from "@/lib/env";
import { NODE_ENV } from "@/schemas/env";
import { TokenType } from "@/types/token.interface";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

// Cookie options
export const cookieData: Pick<
  ResponseCookie,
  "httpOnly" | "secure" | "sameSite" | "path"
> = {
  httpOnly: true,
  secure: inProduction,
  sameSite: inProduction ? "none" : "lax",
  path: "/",
};

export const accessCookieData = {
  ...cookieData,
  name: TokenType.ACCESS,
  expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE * 1000),
  maxAge: ACCESS_TOKEN_MAX_AGE,
} as const;

export const refreshCookieData = {
  ...cookieData,
  name: TokenType.REFRESH,
  expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
  maxAge: REFRESH_TOKEN_MAX_AGE,
} as const;
