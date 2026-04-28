"use server";

import { createUserSchema, loginUserSchema, TLoginUser } from "@/schemas/user";
import { uploadToCloudinary } from "./uploadToCloudinary";
import prisma from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/password";
import { ConflictError, UnauthorizedError } from "http-errors-enhanced";
import { setCookie } from "./cookie";
import { isAuthenticated } from "./isAuthenticated";

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
    });

    await setCookie(result);

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error: unknown) {
    throw error;
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

    await setCookie(user);

    return {
      success: true,
      message: "Login successful! Welcome back!",
    };
  } catch (error: unknown) {
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const { id, email } = await isAuthenticated();

    if (!id || !email) throw new UnauthorizedError("You are not logged in!");

    const user = await prisma.user.findFirst({
      where: {
        id,
        email,
      },
      omit: {
        password: true,
      },
    });

    if (!user) throw new UnauthorizedError("You are not logged in!");

    return user;
  } catch (error: unknown) {
    throw error;
  }
};
