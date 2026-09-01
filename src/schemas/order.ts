import { z } from "zod";

const orderItemSchema = z.object({
  productVariantId: z.string({
    error: (val) => {
      return val.input === undefined
        ? "Product variant is required!"
        : "Invalid product variant!";
    },
  }),
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
});

const orderItemsSchema = z.array(orderItemSchema).min(1);

export const createOrderSchema = z.object({
  items: orderItemsSchema,

  shippingName: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Recipient name is required!"
          : "Invalid recipient name!";
      },
    })
    .trim()
    .min(2, "Recipient name must be at least 2 characters long!")
    .max(100, "Recipient name must be at most 100 characters long!"),

  shippingPhone: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Phone number is required!"
          : "Invalid phone number!";
      },
    })
    .trim()
    .min(11, "Phone number must be exactly 11 digits!")
    .max(11, "Phone number must be exactly 11 digits!")
    .regex(/^\d{11}$/, "Phone number must be 11 digits!"),

  shippingAddress: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Street address is required!"
          : "Invalid street address!";
      },
    })
    .trim()
    .min(5, "Street address must be at least 5 characters long!")
    .max(200, "Street address must be at most 200 characters long!"),

  shippingArea: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Area is required!"
          : "Invalid area!";
      },
    })
    .trim()
    .min(2, "Area must be at least 2 characters long!")
    .max(100, "Area must be at most 100 characters long!"),

  shippingThana: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Thana is required!"
          : "Invalid thana!";
      },
    })
    .trim()
    .min(2, "Thana must be at least 2 characters long!")
    .max(100, "Thana must be at most 100 characters long!"),

  shippingDistrict: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "District is required!"
          : "Invalid district!";
      },
    })
    .trim()
    .min(2, "District must be at least 2 characters long!")
    .max(100, "District must be at most 100 characters long!"),

  shippingDivision: z
    .string({
      error: (val) => {
        return val.input === undefined
          ? "Division is required!"
          : "Invalid division!";
      },
    })
    .trim()
    .min(2, "Division must be at least 2 characters long!")
    .max(100, "Division must be at most 100 characters long!"),

  shippingPostalCode: z
    .string()
    .trim()
    .max(10, "Postal code must be at most 10 characters long!")
    .optional()
    .or(z.literal("")),

  shippingNote: z
    .string()
    .trim()
    .max(200, "Shipping note must be at most 200 characters long!")
    .optional()
    .or(z.literal("")),

  customerNote: z
    .string()
    .trim()
    .max(200, "Customer note must be at most 200 characters long!")
    .optional()
    .or(z.literal("")),
});

export type TCreateOrderInput = z.input<typeof createOrderSchema>;
export type TCreateOrderOutput = z.output<typeof createOrderSchema>;
