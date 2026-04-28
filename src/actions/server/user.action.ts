"use server";

import { createUserSchema } from "@/schemas/user";
import { uploadToCloudinary } from "./uploadToCloudinary";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { ConflictError } from "http-errors-enhanced";
import { setCookie } from "./cookie";

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
