import { User } from "@/generated/prisma/client";

export type TUser = Omit<User, "password">;
export type ITokenUser = Pick<User, "email" | "id" | "role" | "isVerified">;
