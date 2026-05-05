import { Product } from "@/generated/prisma/client";

export type TProduct = Omit<Product, "createdAt" | "updatedAt" | "price"> & {
  price: number;
  createdAt: string;
  updatedAt: string;
};
