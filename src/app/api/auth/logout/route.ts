import { UnauthorizedError } from "http-errors-enhanced";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      throw new UnauthorizedError("You are not logged in!");
    }

    const response = NextResponse.json({
      success: true,
      message: "User logged out successfully!",
    });

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("token");

    return response;
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
