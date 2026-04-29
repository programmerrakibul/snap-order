"use server";

import { verifyAccessToken } from "@/lib/token";
import { ITokenUser } from "@/types/user.interface";
import { TokenExpiredError } from "jsonwebtoken";
import { refreshToken } from "./refreshToken";
import { getAccessToken } from "./getAccessToken";

export const isAuthenticated = async (): Promise<ITokenUser | null> => {
  try {
    const token = await getAccessToken();

    if (!token) return null;

    const user = await verifyAccessToken(token);

    return user;
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      await refreshToken();

      const newAccessToken = await getAccessToken();

      if (!newAccessToken) return null;

      const user = await verifyAccessToken(newAccessToken);
      return user;
    }

    return null;
  }
};
