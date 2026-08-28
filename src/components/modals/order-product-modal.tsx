"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TProduct } from "@/types/product.interface";
import { useState } from "react";
import OrderProductForm from "@/components/forms/order-product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

interface OrderProductModalProps {
  Trigger: React.ReactNode;
  product: TProduct;
}

const OrderProductModal = ({ Trigger, product }: OrderProductModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.primaryVariantId ?? product.variants[0]?.id ?? null,
  );

  const variants = product.variants;
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setSelectedVariantId(
          product.primaryVariantId ?? product.variants[0]?.id ?? null,
        );
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="data-[state=open]:zoom-in-0! data-[state=open]:duration-600 max-w-md">
        <DialogHeader>
          <DialogTitle>Order Product</DialogTitle>
        </DialogHeader>

        {!selectedVariant ? (
          <Card>
            <CardContent>
              <CardDescription>
                <DialogDescription className="text-destructive text-center">
                  This product has no available variants. Please try again later
                  or contact support if the issue persists.
                </DialogDescription>
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-0">
              <CardContent>
                <CardHeader className="p-0">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    <DialogDescription className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Price: $
                        {selectedVariant.discountAmount ??
                          selectedVariant.originalPrice}
                      </span>
                      <span>Stock: {selectedVariant.stock}</span>
                    </DialogDescription>
                  </CardDescription>
                </CardHeader>
              </CardContent>
            </Card>

            {variants.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                      selectedVariant.id === variant.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                    disabled={variant.stock <= 0}
                    title={
                      variant.stock <= 0
                        ? "This variant is out of stock"
                        : Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" · ")
                    }
                  >
                    <span>
                      {Object.entries(variant.attributes).length > 0
                        ? Object.entries(variant.attributes)
                            .map(([, value]) => `${value}`)
                            .join(" / ")
                        : variant.sku}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({variant.stock})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedVariant.stock <= 0 ? (
              <Card>
                <CardContent>
                  <CardDescription>
                    <DialogDescription className="text-destructive text-center">
                      This variant is currently out of stock. Please check back
                      later or contact support for more information.
                    </DialogDescription>
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <OrderProductForm
                product={product}
                variant={selectedVariant}
                setIsOpen={setIsOpen}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderProductModal;
