import { OrderStatus } from "@/generated/prisma/enums";
import { TUser } from "./user.interface";

export interface TInvoiceItem {
  id: string;
  quantity: number;
  totalPrice: number;
  discountAmount: number | null;
  productName: string;
  variantSku: string;
  attributes: Record<string, string> | null;
  unitPrice: number;
}

export interface TInvoice {
  id: string;
  orderId: string;
  totalAmount: number;
  discountAmount: number | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    confirmedAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingArea: string;
    shippingThana: string;
    shippingDistrict: string;
    shippingDivision: string;
    shippingPostalCode: string | null;
    shippingNote: string | null;
    customerNote: string | null;
    items: TInvoiceItem[];
  };
  customer: Pick<TUser, "name" | "email">;
}
