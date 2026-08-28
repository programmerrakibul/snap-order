import { OrderStatus } from "@/generated/prisma/enums";
import { TUser } from "./user.interface";

export type TCreateOrderItem = { productVariantId: string; quantity: number };
export type TCreateOrderInput = { userId: string; shippingAddress: string; items: TCreateOrderItem[] };
export type TOrderResponse = { success: boolean; message: string; error?: string };
export interface TOrderItem { id: string; productVariantId: string; quantity: number; unitPrice: number; createdAt: string; updatedAt: string; productName: string; variantSku: string; }
export interface TOrder { id: string; orderNumber: string; status: OrderStatus; totalAmount: number; userId: string; shippingAddress: string; createdAt: string; updatedAt: string; items: TOrderItem[]; user: Pick<TUser, "name" | "email">; }
