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
import { toast } from "sonner";
import { deleteOrderById } from "@/actions/server/order.action";
import { IconTrash, IconAlertTriangle } from "@tabler/icons-react";

interface DeleteOrderModalProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  onDeleteSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function DeleteOrderModal({
  orderId,
  orderNumber,
  totalAmount,
  onDeleteSuccess,
  trigger,
}: DeleteOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteOrderById(orderId);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        onDeleteSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error("An unexpected error occurred while deleting the order");
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
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete order"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <IconAlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-destructive">
                Delete Order
              </DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
            <p className="text-sm font-medium text-foreground mb-3">
              You are about to permanently delete:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Order Number:
                </span>
                <span className="text-sm font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm font-semibold text-primary">
                  ৳{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Once deleted, the order data will be permanently removed from the
              system and cannot be recovered.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="h-4 w-4" />
                Delete Order
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
