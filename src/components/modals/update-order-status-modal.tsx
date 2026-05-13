"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateOrderStatusById } from "@/actions/server/order.action";
import { OrderStatus } from "@/generated/prisma/enums";
import { STATUS_CONFIG } from "@/lib/constants";
import { IconEdit } from "@tabler/icons-react";

interface UpdateOrderStatusModalProps {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  onStatusUpdateSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function UpdateOrderStatusModal({
  orderId,
  orderNumber,
  currentStatus,
  onStatusUpdateSuccess,
  trigger,
}: UpdateOrderStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  // Available status transitions
  const availableStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  const currentConfig = STATUS_CONFIG[currentStatus];
  const selectedConfig = STATUS_CONFIG[selectedStatus];

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as OrderStatus);
  };

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      toast.info("Please select a different status");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrderStatusById(orderId, selectedStatus);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        setSelectedStatus(currentStatus);
        onStatusUpdateSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error(
        "An unexpected error occurred while updating the order status",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            title="Modify order status"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Current Status */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">
              Current Status
            </label>
            <Badge
              className={`${currentConfig.color} border whitespace-nowrap`}
              variant="outline"
            >
              {currentConfig.label}
            </Badge>
          </div>

          {/* Status Select */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">
              New Status
            </label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => {
                  const config = STATUS_CONFIG[status];
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${config.color.split(" ")[0]}`}
                        />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview New Status */}
          {selectedStatus !== currentStatus && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Preview
              </p>
              <Badge
                className={`${selectedConfig.color} border whitespace-nowrap`}
                variant="outline"
              >
                {selectedConfig.label}
              </Badge>
            </div>
          )}

          {/* Status Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Once updated, the order status will be
              visible to customers and this action cannot be undone. Choose the
              correct status.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setSelectedStatus(currentStatus);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedStatus === currentStatus}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
                Updating...
              </>
            ) : (
              <>
                <IconEdit className="h-4 w-4" />
                Update Status
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
