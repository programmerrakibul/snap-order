import { setCookie } from "@/lib/cookie";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { createUserSchema } from "@/schemas/user";
import { ConflictError, HttpError } from "http-errors-enhanced";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = createUserSchema.parse(await req.json());

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new ConflictError("Email already in use! Try logging in instead.");
    }

    data.password = await hashPassword(data.password);

    const result = await prisma.user.create({
      data,
    });

    const response = NextResponse.json({
      success: true,
      message: "User registered successfully!",
    });

    setCookie(response, result);

    return response;
  } catch (error: unknown) {
    console.error(error);

    let message = "Something went wrong!";
    let status = 500;

    if (error instanceof HttpError) {
      message = error.message;
      status = error.statusCode;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      },
    );
  }
};
