import z from "zod";

export const NODE_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type TNodeEnv = (typeof NODE_ENV)[keyof typeof NODE_ENV];

const NodeEnum = z.enum<TNodeEnv[]>([...Object.values(NODE_ENV)], {
  error: (iss) => {
    return iss.input === undefined
      ? "NODE_ENV is required"
      : `${iss.input} is not a valid NODE_ENV`;
  },
});

export const envSchema = z.object({
  NODE_ENV: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.toLowerCase().trim() as TNodeEnv;
    }

    return val;
  }, NodeEnum),

  DATABASE_URL: z
    .string({
      error: (iss) => {
        return iss.input === undefined
          ? "DATABASE_URL is required"
          : "DATABASE_URL is invalid";
      },
    })
    .trim()
    .min(1, "DATABASE_URL is required"),

  ACCESS_TOKEN_SECRET: z
    .string({
      error: (iss) => {
        return iss.input === undefined
          ? "ACCESS_TOKEN_SECRET is required"
          : "ACCESS_TOKEN_SECRET is invalid";
      },
    })
    .trim()
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters long"),

  REFRESH_TOKEN_SECRET: z
    .string({
      error: (iss) => {
        return iss.input === undefined
          ? "ACCESS_TOKEN_SECRET is required"
          : "ACCESS_TOKEN_SECRET is invalid";
      },
    })
    .trim()
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters long"),

  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
    .string("CLOUDINARY_CLOUD_NAME is required")
    .trim()
    .min(1, "CLOUDINARY_CLOUD_NAME is required"),

  CLOUDINARY_API_KEY: z
    .string("CLOUDINARY_API_KEY is required")
    .trim()
    .length(15, "API key must be exactly 15 characters")
    .regex(/^[a-zA-Z0-9]+$/, "API key must be alphanumeric"),

  CLOUDINARY_API_SECRET: z
    .string("CLOUDINARY_API_SECRET is required")
    .trim()
    .min(1, "CLOUDINARY_API_SECRET is required"),

  NEXT_PUBLIC_SITE_URL: z
    .url("NEXT_PUBLIC_SITE_URL is invalid!")
    .trim()
    .min(1, "NEXT_PUBLIC_SITE_URL is required!"),

  GOOGLE_CLIENT_ID: z
    .string("GOOGLE_CLIENT_ID is required")
    .trim()
    .min(1, "GOOGLE_CLIENT_ID is required!"),

  GOOGLE_CLIENT_SECRET: z
    .string("GOOGLE_CLIENT_SECRET is required")
    .trim()
    .min(1, "GOOGLE_CLIENT_SECRET is required!"),

  GOOGLE_REFRESH_TOKEN: z
    .string("GOOGLE_REFRESH_TOKEN is required")
    .trim()
    .min(1, "GOOGLE_REFRESH_TOKEN is required!"),

  EMAIL_FROM_NAME: z
    .string("EMAIL_FROM_NAME is required")
    .trim()
    .min(1, "EMAIL_FROM_NAME is required!"),

  EMAIL_FROM: z
    .email("EMAIL_FROM is invalid!")
    .trim()
    .min(1, "EMAIL_FROM is required!"),
});

export type TEnv = z.infer<typeof envSchema>;
