import {
  IconCategory,
  IconLayoutDashboard,
  IconPackageImport,
  IconPackages,
  IconReceipt,
  IconReload,
  IconShoppingCart,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

import {
  DiscountType,
  OrderStatus,
  ProductStatus,
  Role,
} from "@/generated/prisma/enums";
import { TSidebarItem } from "@/types";

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

export const PRODUCT_STATUS_CONFIG: Record<
  ProductStatus,
  { color: string; label: string }
> = {
  DRAFT: {
    color: "bg-slate-500/10 text-slate-700 border-slate-200",
    label: "Draft",
  },
  ACTIVE: {
    color: "bg-green-500/10 text-green-700 border-green-200",
    label: "Active",
  },
  ARCHIVED: {
    color: "bg-zinc-500/10 text-zinc-700 border-zinc-200",
    label: "Archived",
  },
  OUT_OF_STOCK: {
    color: "bg-red-500/10 text-red-700 border-red-200",
    label: "Out of Stock",
  },
};

export const DISCOUNT_TYPE_CONFIG: Record<
  DiscountType,
  { color: string; label: string }
> = {
  PERCENTAGE: {
    color: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    label: "%",
  },
  FIXED: {
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
    label: "$",
  },
};

export const sidebarItems: TSidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: IconLayoutDashboard,
    allowedRoles: [Role.ADMIN, Role.USER],
  },
  {
    title: "Add Product",
    href: "/dashboard/add-products",
    icon: IconPackageImport,
    allowedRoles: [Role.ADMIN],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: IconPackages,
    allowedRoles: [Role.ADMIN, Role.USER],
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: IconCategory,
    allowedRoles: [Role.ADMIN],
  },
  {
    title: "Re-Stock Products",
    href: "/dashboard/restock-products",
    icon: IconReload,
    allowedRoles: [Role.ADMIN],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: IconShoppingCart,
    allowedRoles: [Role.ADMIN, Role.USER],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: IconReceipt,
    allowedRoles: [Role.USER],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: IconUsers,
    allowedRoles: [Role.ADMIN],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: IconUserCircle,
    allowedRoles: [Role.ADMIN, Role.USER],
  },
];
