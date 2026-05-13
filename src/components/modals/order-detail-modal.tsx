"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG } from "@/lib/constants";
import { IconEye } from "@tabler/icons-react";
import { TOrder } from "@/types/order.interface";

interface OrderDetailModalProps {
  order: TOrder;
  trigger?: React.ReactNode;
}

export default function OrderDetailModal({
  order,
  trigger,
}: OrderDetailModalProps) {
  const config = STATUS_CONFIG[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            title="View order details"
          >
            <IconEye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[min(700px,85dvh)] data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information for order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(min(700px,85vh)-115px)] overflow-hidden">
          <div className="flex flex-col gap-6 pr-4">
            {/* Order Header */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Order Number
                  </label>
                  <p className="text-lg font-bold mt-1">{order.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={`${config.color} border whitespace-nowrap`}
                      variant="outline"
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Total Amount
                </label>
                <p className="text-2xl font-bold text-primary mt-1">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Total Items
                </label>
                <p className="text-2xl font-bold mt-1">{totalItems}</p>
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Shipping Address
              </label>
              <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                {order.shippingAddress}
              </p>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Order Items ({order.items.length})
              </label>
              <div className="space-y-2">
                {order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg border flex-wrap gap-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Product ID: {item.productId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No items in this order
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Order Date
                </label>
                <p className="text-xs sm:text-sm text-foreground mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-xs sm:text-sm text-foreground mt-1">
                  {new Date(order.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
