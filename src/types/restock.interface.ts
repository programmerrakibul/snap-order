import { TProduct } from "@/types/product.interface";
import { RestockRequestItem, RestockRequest } from "@/generated/prisma/client";

export type TRestockRequest = Omit<
  RestockRequest,
  "createdAt" | "updatedAt" | "approvedAt" | "cancelledAt" | "items"
> & {
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  cancelledAt: string | null;
  items: TRestockRequestItem[];
};

export type TRestockRequestItem = Omit<
  RestockRequestItem,
  "createdAt" | "updatedAt" | "product"
> & {
  createdAt: string;
  updatedAt: string;
  product: Pick<TProduct, "name" | "stock" | "minThreshold" | "maxThreshold">;
};
