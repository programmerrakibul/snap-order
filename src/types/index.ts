import { Role } from "@/generated/prisma/enums";
import { TablerIcon } from "@tabler/icons-react";

export type TSidebarItem = {
  title: string;
  href: string;
  icon: TablerIcon;
  allowedRoles?: Role[];
};

export type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone: string;
};

export * from "./category.interface";
export * from "./invoice.interface";
export * from "./order.interface";
export * from "./product.interface";
export * from "./restock.interface";
export * from "./token.interface";
export * from "./user.interface";
