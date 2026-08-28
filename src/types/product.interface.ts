import { DiscountType, ProductStatus } from "@/generated/prisma/enums";

export type TProductImage = {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
};
export type TProductVariant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  stock: number;
  minThreshold: number;
  maxThreshold: number;
  costPrice: number;
  originalPrice: number;
  discountAmount: number | null;
  discountType: DiscountType | null;
  discountValue: number | null;
  isActive: boolean;
  lastRestockedAt: string | null;
};
export type TProduct = {
  id: string;
  name: string;
  description: string;
  brand: string | null;
  slug: string;
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
  images: TProductImage[];
  variants: TProductVariant[];
  primaryVariantId: string | null;
  price: number;
  stock: number;
  minThreshold: number;
  maxThreshold: number;
  lastRestockedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
