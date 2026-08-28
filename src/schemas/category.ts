import { SLUG_REGEX } from "@/lib/slug";
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(80, "Category name cannot exceed 80 characters."),
  slug: z
    .string()
    .trim()
    .max(100)
    .regex(
      SLUG_REGEX,
      "Slug must contain only lowercase letters, numbers, and hyphens.",
    )
    .optional(),
  image: z.union([z.url("Image URL is invalid!"), z.literal("")]).optional(),
});

export type TCategoryInput = z.input<typeof categorySchema>;
export type TCategoryOutput = z.output<typeof categorySchema>;