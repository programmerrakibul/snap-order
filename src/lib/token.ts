import { BadRequestError } from "http-errors-enhanced";
import type { ITokenUser } from "@/types/user.interface";
import jwt, {
  JwtPayload,
  type PrivateKey,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";
import { getEnv } from "./env";
import prisma from "./prisma";

type IGenToken = {
  payload: ITokenUser;
  secret: Secret | PrivateKey;
  expiresIn?: SignOptions["expiresIn"];
};

const generateToken = ({
  payload,
  secret,
  expiresIn = "15m",
}: IGenToken): string => {
  try {
    if (!secret) {
      throw new BadRequestError("Secret is required!");
    }

    if (!payload?.id || !payload?.email) {
      throw new BadRequestError("Invalid user payload!");
    }

    if (
      expiresIn &&
      typeof expiresIn !== "string" &&
      typeof expiresIn !== "number"
    ) {
      throw new BadRequestError("Invalid expiresIn format!");
    }

    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified,
    };

    return jwt.sign(user, secret, { expiresIn: expiresIn });
  } catch {
    throw new BadRequestError("Failed to generate token!");
  }
};

export const getAccessToken = (payload: ITokenUser): string => {
  try {
    const secret = getEnv().ACCESS_TOKEN_SECRET;

    return generateToken({
      payload,
      secret,
      expiresIn: "15m",
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const getRefreshToken = (payload: ITokenUser): string => {
  try {
    const secret = getEnv().REFRESH_TOKEN_SECRET;

    return generateToken({
      payload,
      secret,
      expiresIn: "7d",
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const verifyToken = async (
  token: string,
  secret: Secret,
): Promise<ITokenUser> => {
  try {
    if (!token) {
      throw new BadRequestError("Token is required!");
    }

    if (!secret) {
      throw new BadRequestError("Secret is required!");
    }

    const result = jwt.verify(token, secret) as JwtPayload;

    if (!result?.id) {
      throw new BadRequestError("Invalid token!");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: result.id,
        email: result.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid token!");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  } catch (error: unknown) {
    throw error;
  }
};

export const verifyAccessToken = async (token: string): Promise<ITokenUser> => {
  try {
    const secret = getEnv().ACCESS_TOKEN_SECRET;

    return await verifyToken(token, secret);
  } catch (error: unknown) {
    throw error;
  }
};

export const verifyRefreshToken = async (
  token: string,
): Promise<ITokenUser> => {
  try {
    const secret = getEnv().REFRESH_TOKEN_SECRET;

    return await verifyToken(token, secret);
  } catch (error: unknown) {
    throw error;
  }
};
