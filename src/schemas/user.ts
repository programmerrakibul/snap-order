import z from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const createUserSchema = z.object({
  name: z
    .string("Invalid name value!")
    .trim()
    .max(50, "Name must be at most 50 characters long!")
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .refine(
      (val) => {
        if (!val?.trim()) return true;

        return val.length >= 3;
      },
      {
        error: "Name must be at least 3 characters long!",
      },
    ),

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
    .max(50, "Password must be at most 50 characters long!")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter!")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter!")
    .regex(/[0-9]/, "Password must contain at least one number!")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character!",
    ),

  photoURL: z
    .instanceof(File, { message: "Please upload a valid image" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      error: "Image must be smaller than 3MB!",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: "Only JPG, PNG and WebP formats are allowed!",
    })
    .optional(),

  phoneNumber: z
    .string("Invalid Phone Number value!")
    .trim()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .refine(
      (val) => {
        if (!val) return true;

        return val.length === 11;
      },
      {
        error: "Phone Number must be 11 characters long!",
      },
    ),
});

export type TCreateUserInput = z.input<typeof createUserSchema>;
export type TCreateUserOutput = z.output<typeof createUserSchema>;

export const loginUserSchema = createUserSchema.pick({
  email: true,
  password: true,
});
