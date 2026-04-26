import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/token";
import { UnauthorizedError } from "http-errors-enhanced";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      throw new UnauthorizedError("You are not logged in!");
    }

    const { id, email } = verifyAccessToken(token);

    const user = await prisma.user.findFirst({
      where: {
        id,
        email,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("You are not logged in!");
    }

    return NextResponse.json({
      success: true,
      message: "Profile fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      { status: 500 },
    );
  }
};
