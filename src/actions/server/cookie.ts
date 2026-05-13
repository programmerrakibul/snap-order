"use server";

import { genAccessToken, genRefreshToken } from "@/lib/token";
import { ITokenUser } from "@/types/user.interface";
import { cookies } from "next/headers";
import { accessCookieData, refreshCookieData } from "@/lib/constants";

export const setCookie = async (user: ITokenUser) => {
  const cookieStore = await cookies(); // Get cookie store

  //  Create payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  // Generate tokens
  const accessToken = genAccessToken(payload);
  const refreshToken = genRefreshToken(payload);

  // Set Access Token
  cookieStore.set({
    value: accessToken,
    ...accessCookieData,
  });

  // Set Refresh Token
  cookieStore.set({
    value: refreshToken,
    ...refreshCookieData,
  });
};
