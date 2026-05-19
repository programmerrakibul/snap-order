import { getEnv } from "@/lib/env";
import { NODE_ENV } from "@/schemas/env";
import { TokenType } from "@/types/token.interface";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "@/lib/constants";

const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

export const PROTECTED_PATHS = {
  ADMIN_ONLY: [
    "/dashboard/add-products",
    "/dashboard/restock-products",
    "/dashboard/customers",
  ],
} 

// Cookie options (server-only)
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
