"use server";

import { UnauthorizedError } from "http-errors-enhanced";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new UnauthorizedError("You are not logged in!");
    }

    return token;
  } catch (error: unknown) {
    throw error;
  }
};
