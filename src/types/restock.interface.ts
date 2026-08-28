import { RestockStatus } from "@/generated/prisma/enums";

export type TRestockRequestItem = {
  id: string;
  restockRequestId: string;
  productVariantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productVariant: {
    sku: string;
    stock: number;
    minThreshold: number;
    maxThreshold: number;
    productName: string;
  };
};
export type TRestockRequest = {
  id: string;
  status: RestockStatus;
  stockedById: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  cancelledAt: string | null;
  items: TRestockRequestItem[];
};
