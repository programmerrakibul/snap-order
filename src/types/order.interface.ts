import { OrderStatus } from "@/generated/prisma/enums";
import { TUser } from "./user.interface";

export type TCreateOrderItem = {
  productVariantId: string;
  quantity: number;
};

export type TCreateOrderInput = {
  customerId: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingArea: string;
  shippingThana: string;
  shippingDistrict: string;
  shippingDivision: string;
  shippingPostalCode?: string;
  shippingNote?: string;
  customerNote?: string;
  items: TCreateOrderItem[];
};

export type TOrderResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export interface TOrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  totalPrice: number;
  discountAmount?: number | null;
  createdAt: string;
  updatedAt: string;
  productName: string;
  variantSku: string;
}

export interface TOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingArea: string;
  shippingThana: string;
  shippingDistrict: string;
  shippingDivision: string;
  shippingPostalCode?: string | null;
  shippingNote?: string | null;
  customerId: string;
  customerNote?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: TOrderItem[];
  customer: Pick<TUser, "name" | "email">;
}
