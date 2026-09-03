"use client";

import DeleteOrderModal from "@/components/modals/delete-order-modal";
import OrderDetailModal from "@/components/modals/order-detail-modal";
import UpdateOrderStatusModal from "@/components/modals/update-order-status-modal";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus, Role } from "@/generated/prisma/enums";
import useUserData from "@/hooks/useUserData";
import { STATUS_CONFIG } from "@/lib/constants";
import { TOrder } from "@/types/order.interface";
import {
  IconDotsVerticalFilled,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

interface OrdersTableProps {
  orders: TOrder[];
  onOrdersChange?: () => void;
}

export default function OrdersTable({
  orders,
  onOrdersChange,
}: OrdersTableProps) {
  const { user } = useUserData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleOrderChange = useCallback(() => {
    onOrdersChange?.();
  }, [onOrdersChange]);

  const columns: DataTableColumn<TOrder>[] = [
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
      header: "Recipient",
      accessor: "shippingName",
      cell: (value) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      header: "Amount",
      accessor: "totalAmount",
      cell: (value) => (
        <span className="font-semibold text-primary">
          ৳{Number(value).toFixed(2)}
        </span>
      ),
      className: "text-right",
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
      cell: (value, order) => {
        const isAdmin = user?.role === Role.ADMIN;
        const isPending = order.status === OrderStatus.PENDING;
        const isExpanded = expandedId === (value as string);
        const isCancelled = order.status === OrderStatus.CANCELLED;
        const isDelivered = order.status === OrderStatus.DELIVERED;
        const isDisabled = isCancelled || isDelivered;

        return (
          <div className="flex items-center justify-end gap-1">
            <DropdownMenu
              open={isExpanded}
              onOpenChange={(open) =>
                setExpandedId(open ? (value as string) : null)
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8"
                  aria-label="Order actions"
                >
                  <IconDotsVerticalFilled className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <OrderDetailModal
                  order={order}
                  trigger={
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      title="View order details"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <IconEye className="h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                  }
                />

                {isAdmin && (
                  <UpdateOrderStatusModal
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                    currentStatus={order.status}
                    onStatusUpdateSuccess={handleOrderChange}
                    trigger={
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        title={
                          isDisabled
                            ? "Can only modify pending, confirmed, and shipped orders"
                            : "Modify order status"
                        }
                        disabled={isDisabled}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <IconEdit className="h-4 w-4" />
                        <span>Modify Status</span>
                      </DropdownMenuItem>
                    }
                  />
                )}

                {isPending && (
                  <DeleteOrderModal
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                    totalAmount={order.totalAmount}
                    onDeleteSuccess={handleOrderChange}
                    trigger={
                      <DropdownMenuItem
                        variant="destructive"
                        className="flex items-center gap-2 cursor-pointer"
                        title="Delete order"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <IconTrash className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    }
                  />
                )}

                {!isPending && (
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={true}
                    title="Can only delete pending orders"
                  >
                    <IconTrash className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      className: "text-right",
    },
  ];

  return <DataTable columns={columns} data={orders} pageSize={10} />;
}
