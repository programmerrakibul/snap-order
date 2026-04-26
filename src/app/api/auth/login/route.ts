import { getEnv } from "@/lib/env";
import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { getAccessToken, getRefreshToken } from "@/lib/token";
import { NODE_ENV } from "@/schemas/env";
import { loginUserSchema } from "@/schemas/user";
import { UnauthorizedError } from "http-errors-enhanced";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = loginUserSchema.parse(await req.json());

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials!");
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials!");
    }

    await prisma.user.update({
      data: {
        lastLoggedIn: new Date(),
      },
      where: {
        id: user.id,
        email: user.email,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "User logged in successfully!",
    });

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);
    const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

    const cookieData: Pick<
      ResponseCookie,
      "httpOnly" | "secure" | "sameSite" | "path"
    > = {
      httpOnly: true,
      secure: inProduction,
      sameSite: inProduction ? "none" : "lax",
      path: "/",
    };

    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      maxAge: 60 * 60 * 24 * 7,
      ...cookieData,
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      maxAge: 60 * 60 * 24 * 7,
      ...cookieData,
    });

    return response;
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 },
    );
  }
};
