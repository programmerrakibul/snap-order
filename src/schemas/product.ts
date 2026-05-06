import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Name field is required!"
          : "Invalid name value!";
      },
    })
    .trim()
    .min(3, "Name must be at least 3 characters long!")
    .max(50, "Name must be at most 50 characters long!"),

  description: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Description field is required!"
          : "Invalid description value!";
      },
    })
    .trim()
    .min(15, "Description must be at least 15 characters long!")
    .max(500, "Description must be at most 500 characters long!"),

  price: z.coerce
    .number({
      error: (val) => {
        return val.input === undefined
          ? "Price field is required!"
          : "Invalid price value!";
      },
    })
    .refine((val) => !isNaN(val), "Price must be a number!")
    .min(1, "Price must be at least 1!")
    .max(10000, "Price must be at most 10000!")
    .transform((val) => parseFloat(val.toFixed(2))),

  stock: z.coerce
    .number({
      error: (val) => {
        return val.input === undefined
          ? "Stock field is required!"
          : "Invalid stock value!";
      },
    })
    .refine((val) => !isNaN(val), "Stock must be a number!")
    .min(1, "Stock must be at least 1!")
    .max(10000, "Stock must be at most 10000!"),
});

export type TProductInput = z.input<typeof productSchema>;
export type TProductOutput = z.output<typeof productSchema>;
export type TProduct = z.infer<typeof productSchema>;
