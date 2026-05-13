"use server";

import { refreshCookieData } from "@/lib/constants-server";
import { genAccessToken, verifyRefreshToken } from "@/lib/token";
import { TokenType } from "@/types/token.interface";
import { UnauthorizedError } from "http-errors-enhanced";
import { cookies } from "next/headers";

export const refreshToken = async () => {
  const cookieStore = await cookies();

  try {
    const token = (await cookies()).get(TokenType.REFRESH)?.value;

    if (!token) throw new UnauthorizedError("No refresh token!");

    const user = await verifyRefreshToken(token);

    const newAccessToken = genAccessToken(user);

    cookieStore.set({
      value: newAccessToken,
      ...refreshCookieData,
    });
  } catch {
    cookieStore.delete(TokenType.ACCESS);
    cookieStore.delete(TokenType.REFRESH);

    throw new UnauthorizedError("Invalid refresh token!");
  }
};
