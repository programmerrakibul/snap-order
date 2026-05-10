"use server";

import { getEnv } from "@/lib/env";
import { getAccessToken, verifyRefreshToken } from "@/lib/token";
import { NODE_ENV } from "@/schemas/env";
import { UnauthorizedError } from "http-errors-enhanced";
import { cookies } from "next/headers";

export const refreshToken = async () => {
  const cookieStore = await cookies();

  try {
    const token = (await cookies()).get("refreshToken")?.value;

    if (!token) throw new UnauthorizedError("No refresh token");

    const user = await verifyRefreshToken(token);

    const ACCESS_TOKEN_MAX_AGE = 15 * 60;
    const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

    const newAccessToken = getAccessToken(user);

    cookieStore.set({
      name: "accessToken",
      value: newAccessToken,
      expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE * 1000),
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      secure: inProduction,
      sameSite: inProduction ? "none" : "lax",
      path: "/",
    });
  } catch {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    throw new UnauthorizedError("Invalid refresh token");
  }
};
