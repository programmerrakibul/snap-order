import { z } from "zod";

export const createOrderSchema = z.object({
  quantity: z.coerce
    .number({
      error: (val) => {
        return val.input === undefined
          ? "Quantity field is required!"
          : "Invalid quantity value!";
      },
    })
    .refine((val) => !isNaN(val), "Quantity must be a number!")
    .min(1, "Quantity must be at least 1!")
    .max(100, "Quantity must be at most 100!"),

  shippingAddress: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Shipping address is required!"
          : "Invalid shipping address!";
      },
    })
    .trim()
    .min(10, "Shipping address must be at least 10 characters long!")
    .max(200, "Shipping address must be at most 200 characters long!"),
});

export type TCreateOrderInput = z.input<typeof createOrderSchema>;
export type TCreateOrderOutput = z.output<typeof createOrderSchema>;
