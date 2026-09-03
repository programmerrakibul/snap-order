"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/generated/prisma/enums";
import useUserData from "@/hooks/useUserData";
import { STATUS_CONFIG } from "@/lib/constants";
import { TOrder } from "@/types/order.interface";
import { IconEye, IconPhone, IconUser, IconMapPin } from "@tabler/icons-react";

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
  const { user } = useUserData();
  const isAdmin = user?.role === Role.ADMIN;

  const fullAddress = [
    order.shippingAddress,
    order.shippingArea,
    order.shippingThana,
    order.shippingDistrict,
    order.shippingDivision,
    order.shippingPostalCode,
  ]
    .filter(Boolean)
    .join(", ");

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
                  ৳{order.totalAmount.toFixed(2)}
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

            <div className="space-y-4">
              {/* Customer Information */}
              {isAdmin && (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <IconUser className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-semibold text-muted-foreground">
                        Customer Name
                      </label>
                    </div>
                    <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                      {order.customer.name || "Unnamed customer"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">
                      Customer Email
                    </label>
                    <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md break-all">
                      {order.customer.email}
                    </p>
                  </div>
                </>
              )}

              {/* Recipient */}
              <div>
                <div className="flex items-center gap-2">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Recipient
                  </label>
                </div>
                <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                  {order.shippingName}
                </p>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Phone
                  </label>
                </div>
                <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                  {order.shippingPhone}
                </p>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Shipping Address
                  </label>
                </div>
                <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                  {fullAddress}
                </p>
              </div>

              {order.shippingNote && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Shipping Note
                  </label>
                  <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                    {order.shippingNote}
                  </p>
                </div>
              )}

              {order.customerNote && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Customer Note
                  </label>
                  <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                    {order.customerNote}
                  </p>
                </div>
              )}

              {order.status === "CANCELLED" && order.cancellationReason && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Cancellation Reason
                  </label>
                  <p className="text-sm text-foreground mt-2 leading-relaxed p-3 bg-muted rounded-md">
                    {order.cancellationReason}
                  </p>
                </div>
              )}
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
                          {item.productName} ({item.variantSku})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity} × ৳{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ৳{item.totalPrice.toFixed(2)}
                        </p>
                        {item.discountAmount ? (
                          <p className="text-xs text-muted-foreground">
                            Discount: -৳{item.discountAmount.toFixed(2)}
                          </p>
                        ) : null}
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
              {order.confirmedAt && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Confirmed At
                  </label>
                  <p className="text-xs sm:text-sm text-foreground mt-1">
                    {new Date(order.confirmedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {order.shippedAt && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Shipped At
                  </label>
                  <p className="text-xs sm:text-sm text-foreground mt-1">
                    {new Date(order.shippedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {order.deliveredAt && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Delivered At
                  </label>
                  <p className="text-xs sm:text-sm text-foreground mt-1">
                    {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {order.status === "CANCELLED" && order.cancelledAt && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Cancelled At
                  </label>
                  <p className="text-xs sm:text-sm text-foreground mt-1">
                    {new Date(order.cancelledAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
