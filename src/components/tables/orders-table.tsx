"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import useUserData from "@/hooks/useUserData";
import { OrderStatus, Role } from "@/generated/prisma/enums";
import {
  IconEye,
  IconChevronDown,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { STATUS_CONFIG } from "@/lib/constants";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  userId: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const { user } = useUserData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleView = () => {
    toast.info("View order details - Coming soon!");
  };

  const handleDelete = (status: OrderStatus) => {
    if (status !== OrderStatus.PENDING && user?.role !== Role.ADMIN) {
      toast.error("Can only delete pending orders");
      return;
    }
    toast.info("Delete order - Coming soon!");
  };

  const handleModifyStatus = () => {
    toast.info("Modify order status - Coming soon!");
  };

  const columns: DataTableColumn<Order>[] = [
    {
      header: "Order #",
      accessor: "orderNumber",
      className: "font-medium",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const status = value as OrderStatus;
        const config = STATUS_CONFIG[status];
        return (
          <Badge
            variant="outline"
            className={`${config.color} border whitespace-nowrap`}
          >
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Amount",
      accessor: "totalAmount",
      cell: (value) => (
        <span className="font-semibold text-primary">
          ${Number(value).toFixed(2)}
        </span>
      ),
      className: "text-right",
    },
    {
      header: "Items",
      accessor: "items",
      cell: (value) => {
        const items = value as OrderItem[];
        return (
          <span className="text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        );
      },
      className: "text-center",
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (value) => {
        const date = new Date(value as string);
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
      className: "text-right",
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (value, row) => {
        const order = row as Order;
        const isAdmin = user?.role === Role.ADMIN;
        const isPending = order.status === OrderStatus.PENDING;
        const isExpanded = expandedId === order.id;

        if (isAdmin) {
          return (
            <div className="flex items-center justify-end gap-1">
              <DropdownMenu
                open={isExpanded}
                onOpenChange={(open) => setExpandedId(open ? order.id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8"
                    aria-label="Order actions"
                  >
                    <IconChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => handleView()}
                    className="flex items-center gap-2"
                  >
                    <IconEye className="h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleModifyStatus()}
                    className="flex items-center gap-2"
                  >
                    <IconEdit className="h-4 w-4" />
                    <span>Modify Status</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(order.status)}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <IconTrash className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }

        // User actions
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleView()}
              title="View order details"
              className="h-8 w-8"
            >
              <IconEye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(order.status)}
              disabled={!isPending}
              title={
                !isPending ? "Can only delete pending orders" : "Delete order"
              }
              className="h-8 w-8"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      className: "text-right",
    },
  ];

  return <DataTable columns={columns} data={orders} pageSize={10} />;
}
