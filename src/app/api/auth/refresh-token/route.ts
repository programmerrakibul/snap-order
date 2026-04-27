import { setCookie } from "@/actions/server/cookie";
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

    await setCookie(user);

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully!",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      {
        status: 500,
      },
    );
  }
};
