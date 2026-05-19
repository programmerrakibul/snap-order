import { TablerIcon } from "@tabler/icons-react";

export type TSideberItem = {
  title: string;
  href: string;
  icon: TablerIcon;
  adminOnly?: true;
};

export type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone: string;
};

export * from "./order.interface";
export * from "./product.interface";
export * from "./restock.interface";
export * from "./token.interface";
export * from "./user.interface";
