import { setCookie } from "@/lib/cookie";
import { verifyRefreshToken } from "@/lib/token";
import { UnauthorizedError } from "http-errors-enhanced";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("refreshToken")?.value;

    if (!token) {
      throw new UnauthorizedError(
        "You don't have permission to access this route!",
      );
    }

    const user = verifyRefreshToken(token);

    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully!",
    });

    setCookie(response, user);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
