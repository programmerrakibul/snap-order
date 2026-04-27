"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getAccessToken, getRefreshToken } from "../../lib/token";
import { getEnv } from "../../lib/env";
import { NODE_ENV } from "@/schemas/env";
import { ITokenUser } from "@/types/user.interface";
import { cookies } from "next/headers";

export const setCookie = async (user: ITokenUser) => {
  const cookieStore = await cookies();

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  const accessToken = getAccessToken(payload);
  const refreshToken = getRefreshToken(payload);
  const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

  const cookieData: Pick<
    ResponseCookie,
    "httpOnly" | "secure" | "sameSite" | "path"
  > = {
    httpOnly: true,
    secure: inProduction,
    sameSite: inProduction ? "none" : "lax",
    path: "/",
  };

  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    maxAge: 60 * 60 * 24 * 7,
    ...cookieData,
  });

  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    maxAge: 60 * 60 * 24 * 7,
    ...cookieData,
  });
};
