import { OrderStatus } from "@/generated/prisma/enums";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; label: string }
> = {
  PENDING: {
    color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    label: "Pending",
  },
  CONFIRMED: {
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
    label: "Confirmed",
  },
  SHIPPED: {
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
    label: "Shipped",
  },
  DELIVERED: {
    color: "bg-green-500/10 text-green-700 border-green-200",
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-red-500/10 text-red-700 border-red-200",
    label: "Cancelled",
  },
};
