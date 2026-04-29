"use server";

import { cookies } from "next/headers";

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) return null;

    return token;
  } catch (error: unknown) {
    throw error;
  }
};
