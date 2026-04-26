import { envSchema } from "@/schemas/env";
import z from "zod";
import { BadRequestError } from "http-errors-enhanced";

export const getEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;

    console.error(result.error);

    throw new BadRequestError("Invalid environment variables!", fieldErrors);
  }

  return result.data;
};
