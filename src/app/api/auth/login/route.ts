import { setCookie } from "@/actions/server/cookie";
import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { loginUserSchema } from "@/schemas/user";
import { UnauthorizedError } from "http-errors-enhanced";
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

    await setCookie(user);

    return response;
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 },
    );
  }
};
