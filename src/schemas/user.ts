import { Role } from "@/generated/prisma/enums";
import z from "zod";

const RoleEnum = z.enum<Role[]>(Object.values(Role), "Invalid role value!");

export const createUserSchema = z.object({
  name: z
    .string("Invalid name value!")
    .trim()
    .min(3, "Name must be at least 3 characters long!")
    .max(50, "Name must be at most 50 characters long!")
    .nullable()
    .default(null),

  email: z
    .email({
      error: (iss) => {
        return iss.input === undefined
          ? "Email field is required!"
          : "Invalid email value!";
      },
    })
    .trim()
    .lowercase(),

  password: z
    .string({
      error: (iss) => {
        return iss.input === undefined
          ? "Password field is required!"
          : "Invalid password value!";
      },
    })
    .min(8, "Password must be at least 8 characters long!")
    .max(50, "Password must be at most 50 characters long!"),

  photoURL: z
    .url("Invalid photoURL value!")
    .trim()
    .lowercase()
    .nullable()
    .default(null),

  phoneNumber: z
    .string("Invalid phoneNumber value!")
    .length(11, "Phone number must be 11 digits long!")
    .nullable()
    .default(null),

  role: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.toUpperCase().trim() as Role;
      }
    }, RoleEnum)
    .default(Role.USER),
});

export const loginUserSchema = createUserSchema.pick({
  email: true,
  password: true,
});
