"use server";

import { createUserSchema, loginUserSchema, TLoginUser } from "@/schemas/user";
import { uploadToCloudinary } from "./uploadToCloudinary";
import prisma from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/password";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "http-errors-enhanced";
import { setCookie } from "./cookie";
import { isAuthenticated } from "./isAuthenticated";
import { cookies } from "next/headers";
import { getErrorResponse } from "@/lib/error";
import { TUser } from "@/types/user.interface";

export const createUser = async (formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData);
    const data = createUserSchema.parse(rawData);
    let photoURL: string | undefined = undefined;
    data.password = await hashPassword(data.password);

    const isUserExists = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExists) {
      throw new ConflictError("Email already in use! Try logging in instead.");
    }

    if (data.photoURL instanceof File) {
      photoURL = await uploadToCloudinary(data.photoURL, {
        folder: "users",
      });
    }

    const result = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        photoURL: photoURL,
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    await setCookie(result);

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);
    throw new Error(message);
  }
};

export const loginUser = async (payload: TLoginUser) => {
  try {
    const { email, password } = loginUserSchema.parse(payload);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid credentials!");
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestError("Invalid credentials!");
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

    await setCookie(user);

    return {
      success: true,
      message: "Login successful! Welcome back!",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    throw new Error(message);
  }
};

export const getUserData = async (): Promise<TUser | null> => {
  try {
    const data = await isAuthenticated();

    if (!data) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: data.id,
        email: data.email,
      },
      omit: {
        password: true,
      },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token)
      throw new UnauthorizedError(
        "You have no permission to perform this action!",
      );

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "Logout successful! See you later!",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);
    throw new Error(message);
  }
};
