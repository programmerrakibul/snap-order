"use server";

import { sendEmailVerificationOtp, sendResetEmail } from "@/lib/email";
import { getErrorResponse } from "@/lib/error";
import {
  generateOtpCode,
  getOtpExpiryDate,
  hashOtpCode,
  OTP_MAX_ATTEMPTS,
  verifyOtpCode,
} from "@/lib/otp";
import { comparePassword, hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import {
  createUserSchema,
  emailVerificationSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  TLoginUser,
  updateUserSchema,
} from "@/schemas/user";
import { TokenType } from "@/types/token.interface";
import { TUser, VerificationEmailUser } from "@/types/user.interface";
import {
  BadRequestError,
  ConflictError,
  HttpError,
  UnauthorizedError,
} from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { setCookie } from "./cookie";
import { isAuthenticated } from "./isAuthenticated";
import { uploadToCloudinary } from "./uploadToCloudinary";

const sendVerificationCode = async (user: VerificationEmailUser) => {
  try {
    const code = generateOtpCode();
    const hashedCode = await hashOtpCode(code);

    await prisma.user.update({
      data: {
        verificationCodeExpiry: getOtpExpiryDate(),
        verificationAttempts: 0,
        lastVerificationAttempt: null,
        verificationCode: hashedCode,
      },
      where: {
        id: user.id,
        email: user.email,
      },
    });

    const res = await sendEmailVerificationOtp({
      to: user.email,
      name: user.name,
      code,
    });

    console.log({ res });
  } catch (error: unknown) {
    console.error(`Error sending verification code: ${error}`);

    throw error;
  }
};

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
        name: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    await sendVerificationCode(result);

    return {
      success: true,
      message: "Registration successful! Please verify your email.",
      requiresVerification: true,
      email: result.email,
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
        name: true,
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

    if (!user.isVerified) {
      await sendVerificationCode(user);

      return {
        success: false,
        message:
          "Your email is not verified. We sent a new verification code to your inbox.",
        requiresVerification: true,
        email: user.email,
      };
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
    console.error(`Error logging in: ${error}`);

    const { message } = getErrorResponse(error);

    throw new Error(message);
  }
};

export const verifyEmailOtp = async (payload: {
  email: string;
  code: string;
}) => {
  try {
    const { email, code } = emailVerificationSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        verificationCode: true,
        verificationAttempts: true,
        verificationCodeExpiry: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid verification code!");
    }

    if (user.isVerified) {
      await setCookie({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

      return {
        success: true,
        message: "Email already verified.",
      };
    }

    if (
      !user.verificationCode ||
      !user.verificationCodeExpiry ||
      user.verificationCodeExpiry.getTime() < Date.now()
    ) {
      throw new BadRequestError(
        "Verification code expired. Request a new one.",
      );
    }

    if (user.verificationAttempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestError(
        "This verification code has reached the attempt limit. Request a new one.",
      );
    }

    const isValidCode = await verifyOtpCode(code, user.verificationCode);

    if (!isValidCode) {
      await prisma.user.update({
        data: {
          verificationAttempts: {
            increment: 1,
          },
          lastVerificationAttempt: new Date(),
        },
        where: {
          id: user.id,
        },
      });

      throw new BadRequestError("Invalid verification code!");
    }

    const verifiedUser = await prisma.user.update({
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
        verificationAttempts: 0,
        lastVerificationAttempt: new Date(),
      },
      where: {
        id: user.id,
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    await setCookie(verifiedUser);

    return {
      success: true,
      message: "Email verified successfully!",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    return {
      success: false,
      message,
    };
  }
};

export const resendEmailVerification = async (payload: { email: string }) => {
  try {
    const { email } = resendVerificationSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Unable to send verification code.");
    }

    if (user.isVerified) {
      return {
        success: true,
        message: "Email already verified.",
      };
    }

    await sendVerificationCode(user);

    return {
      success: true,
      message: "A new verification code has been sent.",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    return {
      success: false,
      message,
    };
  }
};

export const getUserData = async (): Promise<TUser | null> => {
  "use cache: private";

  try {
    const data = await isAuthenticated();

    if (!data) return null;

    const user = await prisma.user.findUnique({
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

export const getAllUsers = async () => {
  "use cache";
  cacheLife("weeks");

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoggedIn: user.lastLoggedIn.toISOString(),
    }));
  } catch (error: unknown) {
    console.error(
      "Error fetching users:",
      (error as Error | HttpError).message,
    );

    return [];
  }
};

export const updateUserData = async (formData: FormData) => {
  try {
    const user = await isAuthenticated();
    const data: Record<string, string> = {};

    if (!user) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
        error: "UNAUTHORIZED",
      };
    }

    const rawData = Object.fromEntries(formData);
    const { photoURL, name, phoneNumber } = updateUserSchema.parse(rawData);

    if (photoURL instanceof File) {
      data.photoURL = await uploadToCloudinary(photoURL, {
        folder: "users",
      });
    }

    if (name) data.name = name;
    if (phoneNumber) data.phoneNumber = phoneNumber;

    await prisma.user.update({
      data,
      where: {
        email: user.email,
        id: user.id,
      },
    });

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message || "Something went wrong!",
      error: (error as Error).name || "SERVER_ERROR",
    };
  }
};

export const logoutUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TokenType.ACCESS)?.value;

    if (!token)
      throw new UnauthorizedError(
        "You have no permission to perform this action!",
      );

    cookieStore.delete(TokenType.ACCESS);
    cookieStore.delete(TokenType.REFRESH);

    return {
      success: true,
      message: "Logout successful! See you later!",
    };
  } catch (error: unknown) {
    console.error("Error logging out:", error);

    return {
      success: false,
      message: "Logout failed!",
    };
  }
};

const sendForgotPasswordCode = async (user: { id: string; name: string | null; email: string }) => {
  try {
    const code = generateOtpCode();
    const hashedCode = await hashOtpCode(code);

    await prisma.user.update({
      data: {
        resetPasswordExpiry: getOtpExpiryDate(),
        resetPasswordAttempts: 0,
        lastResetAttempt: null,
        resetPasswordCode: hashedCode,
      },
      where: {
        id: user.id,
        email: user.email,
      },
    });

    await sendResetEmail({
      to: user.email,
      name: user.name,
      code,
    });
  } catch (error: unknown) {
    console.error(`Error sending forgot password code: ${error}`);
    throw error;
  }
};

export const forgotPassword = async (payload: { email: string }) => {
  try {
    const { email } = forgotPasswordSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new BadRequestError("User not found with this email!");
    }

    if (!user.isActive) {
      throw new BadRequestError("Your account is suspended.");
    }

    await sendForgotPasswordCode(user);

    return {
      success: true,
      message: "Reset code sent! Please check your email.",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);
    throw new Error(message);
  }
};

export const verifyForgotPasswordOtp = async (payload: {
  email: string;
  code: string;
}) => {
  try {
    const { email, code } = emailVerificationSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        resetPasswordCode: true,
        resetPasswordAttempts: true,
        resetPasswordExpiry: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid verification code!");
    }

    if (
      !user.resetPasswordCode ||
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry.getTime() < Date.now()
    ) {
      throw new BadRequestError("Reset code expired. Request a new one.");
    }

    if (user.resetPasswordAttempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestError(
        "This reset code has reached the attempt limit. Request a new one.",
      );
    }

    const isValidCode = await verifyOtpCode(code, user.resetPasswordCode);

    if (!isValidCode) {
      await prisma.user.update({
        data: {
          resetPasswordAttempts: {
            increment: 1,
          },
          lastResetAttempt: new Date(),
        },
        where: {
          id: user.id,
        },
      });

      throw new BadRequestError("Invalid verification code!");
    }

    return {
      success: true,
      message: "Reset code verified successfully!",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    return {
      success: false,
      message,
    };
  }
};

export const resetForgotPassword = async (payload: {
  email: string;
  code: string;
  password: string;
}) => {
  try {
    const { email, code, password } = resetPasswordSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        resetPasswordCode: true,
        resetPasswordAttempts: true,
        resetPasswordExpiry: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid reset request!");
    }

    if (
      !user.resetPasswordCode ||
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry.getTime() < Date.now()
    ) {
      throw new BadRequestError("Reset code expired. Request a new one.");
    }

    if (user.resetPasswordAttempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestError(
        "This reset code has reached the attempt limit. Request a new one.",
      );
    }

    const isValidCode = await verifyOtpCode(code, user.resetPasswordCode);

    if (!isValidCode) {
      await prisma.user.update({
        data: {
          resetPasswordAttempts: {
            increment: 1,
          },
          lastResetAttempt: new Date(),
        },
        where: {
          id: user.id,
        },
      });

      throw new BadRequestError("Invalid verification code!");
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpiry: null,
        resetPasswordAttempts: 0,
        lastResetAttempt: new Date(),
      },
      where: {
        id: user.id,
      },
    });

    return {
      success: true,
      message: "Password reset successfully! You can now log in.",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    return {
      success: false,
      message,
    };
  }
};

export const resendForgotPasswordOtp = async (payload: { email: string }) => {
  try {
    const { email } = resendVerificationSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Unable to send reset code.");
    }

    if (!user.isActive) {
      throw new BadRequestError("Your account is suspended.");
    }

    await sendForgotPasswordCode(user);

    return {
      success: true,
      message: "A new password reset code has been sent.",
    };
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    return {
      success: false,
      message,
    };
  }
};

