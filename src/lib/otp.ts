import { comparePassword, hashPassword } from "@/lib/password";
import { randomInt } from "crypto";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

export const generateOtpCode = () =>
  randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");

export const getOtpExpiryDate = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

export const hashOtpCode = (code: string) => hashPassword(code);

export const verifyOtpCode = (code: string, hashedCode: string) => {
  return comparePassword(code, hashedCode);
};
