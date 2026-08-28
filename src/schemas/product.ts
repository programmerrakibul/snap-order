import { DiscountType } from "@/generated/prisma/enums";
import { SLUG_REGEX } from "@/lib/slug";
import { z } from "zod";

const money = (min = 0) =>
  z.coerce
    .number()
    .finite()
    .min(min)
    .transform((value) => Number(value.toFixed(2)));

const attributeRowSchema = z.object({
  key: z.string().trim().max(50),
  value: z.string().trim().max(200),
});

const imageSchema = z.object({
  url: z.string().trim().url("Please provide a valid image URL."),
});

const variantSchema = z
  .object({
    variantId: z.string().trim().optional(),
    sku: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z0-9-]{6,12}$/,
        "SKU must contain 6-12 uppercase letters, numbers, or hyphens.",
      ),
    attributeRows: z.array(attributeRowSchema).default([]),
    stock: z.coerce.number().int().min(0).max(100000),
    minThreshold: z.coerce.number().int().min(0).max(100000).default(10),
    maxThreshold: z.coerce.number().int().min(1).max(100000).default(100),
    costPrice: money(),
    originalPrice: money(0.01),
    discountType: z
      .enum([DiscountType.PERCENTAGE, DiscountType.FIXED])
      .optional(),
    discountValue: money().optional(),
    supplierId: z.string().trim().optional(),
  })
  .superRefine((data, context) => {
    if (data.minThreshold > data.maxThreshold)
      context.addIssue({
        code: "custom",
        path: ["minThreshold"],
        message: "Minimum threshold cannot exceed the maximum threshold.",
      });
    if (data.costPrice > data.originalPrice)
      context.addIssue({
        code: "custom",
        path: ["costPrice"],
        message: "Cost price cannot exceed the selling price.",
      });
    if (data.discountType && data.discountValue === undefined)
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Discount value is required when a discount type is selected.",
      });
  });

export const productSchema = z
  .object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().min(15).max(500),
    slug: z
      .string()
      .trim()
      .max(100)
      .regex(
        SLUG_REGEX,
        "Slug must contain only lowercase letters, numbers, and hyphens.",
      )
      .optional(),
    brand: z.string().trim().max(80).optional(),
    categoryName: z.string().trim().min(2).max(80),
    tags: z.string().trim().max(250).optional(),
    imageUrls: z
      .array(imageSchema)
      .min(1, "At least one product image is required."),
    variants: z
      .array(variantSchema)
      .min(1, "At least one variant is required."),
  })
  .superRefine((data, context) => {
    const seenSkus = new Set<string>();

    data.variants.forEach((variant, index) => {
      if (seenSkus.has(variant.sku)) {
        context.addIssue({
          code: "custom",
          path: [`variants.${index}.sku`],
          message: "Duplicate SKUs within the same product are not allowed.",
        });
      }

      seenSkus.add(variant.sku);
    });
  });

export type TProductInput = z.input<typeof productSchema>;
export type TProductOutput = z.output<typeof productSchema>;