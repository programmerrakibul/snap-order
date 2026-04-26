import bcrypt from "bcryptjs";
import { BadRequestError } from "http-errors-enhanced";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch {
    throw new BadRequestError("Failed to hash password!");
  }
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    throw new BadRequestError("Failed to compare password!");
  }
};
