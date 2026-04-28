"use server";

import { verifyAccessToken } from "@/lib/token";
import { ITokenUser } from "@/types/user.interface";
import { TokenExpiredError } from "jsonwebtoken";
import { refreshToken } from "./refreshToken";
import { getAccessToken } from "./getAccessToken";

export const isAuthenticated = async (): Promise<ITokenUser> => {
  try {
    const token = await getAccessToken();
    const user = await verifyAccessToken(token);

    return user;
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      await refreshToken();

      const newAccessToken = await getAccessToken();

      const user = await verifyAccessToken(newAccessToken);
      return user;
    }

    throw error;
  }
};
