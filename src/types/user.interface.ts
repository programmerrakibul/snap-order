import { User } from "@/generated/prisma/client";

export type ITokenUser = Pick<User, "email" | "id" | "role" | "isVerified">;
