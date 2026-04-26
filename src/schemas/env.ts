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
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql://", "DATABASE_URL is invalid"),

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
});

export type TEnv = z.infer<typeof envSchema>;
