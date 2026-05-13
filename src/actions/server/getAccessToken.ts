"use server";

import { TokenType } from "@/types/token.interface";
import { cookies } from "next/headers";

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TokenType.ACCESS)?.value;

    return token ?? null;
  } catch (error: unknown) {
    throw error;
  }
};
