"use server";

import { verifyRefreshToken } from "@/lib/token";
import { UnauthorizedError } from "http-errors-enhanced";
import { cookies } from "next/headers";
import { setCookie } from "./cookie";

export const refreshToken = async () => {
  try {
    const token = (await cookies()).get("refreshToken")?.value;

    if (!token) {
      throw new UnauthorizedError("You don't have permission to access this!");
    }

    const user = await verifyRefreshToken(token);

    await setCookie(user);
  } catch {
    throw new UnauthorizedError("You don't have permission to access this!");
  }
};
