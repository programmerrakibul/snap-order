"use client";

import { getProductById } from "@/actions/server/product.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TProduct } from "@/types/product.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderProductForm from "@/components/forms/order-product-form";

interface OrderProductModalProps {
  Trigger: React.ReactNode;
  productId: string;
}

const OrderProductModal = ({ Trigger, productId }: OrderProductModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(true);
  const [product, setProduct] = useState<TProduct | null>(null);

  useEffect(() => {
    (async () => {
      if (!isOpen) return;
      setIsLoadingProduct(true);
      
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error(error);
        setProduct(null);
        toast.error("Failed to load product details!");
      } finally {
        setIsLoadingProduct(false);
      }
    })();
  }, [productId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="data-[state=open]:zoom-in-0! data-[state=open]:duration-600 max-w-md">
        <>
          {isLoadingProduct && (
            <div className="flex flex-col gap-3 py-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          )}

          {!isLoadingProduct && !product && (
            <>
              <DialogHeader className="text-center">
                <DialogTitle className="text-destructive">Failed</DialogTitle>
                <DialogDescription className="text-destructive">
                  Product not found or failed to load!
                </DialogDescription>
              </DialogHeader>
            </>
          )}

          {!isLoadingProduct && product && product.stock <= 0 && (
            <>
              <DialogHeader className="text-center">
                <DialogTitle className="text-destructive">
                  Out of stock
                </DialogTitle>
                <DialogDescription className="text-destructive">
                  The product is currently out of stock.
                </DialogDescription>
              </DialogHeader>
            </>
          )}

          {!isLoadingProduct && product && product.stock > 0 && (
            <>
              <DialogTitle>Order Product</DialogTitle>

              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-foreground">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Price: ${product.price}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>

                <OrderProductForm product={product} setIsOpen={setIsOpen} />
              </div>
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default OrderProductModal;
