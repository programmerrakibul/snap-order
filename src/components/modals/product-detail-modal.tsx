"use client";

import { useEffect, useState } from "react";
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
import { TProduct } from "@/types/product.interface";
import { ScrollArea } from "../ui/scroll-area";

interface ProductDetailModalProps {
  productId: string;
  Trigger: React.ReactNode;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export function ProductDetailModal({
  productId,
  Trigger,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetch(`${BASE_URL}/api/products/${productId}`, {
          cache: "force-cache",
        });

        if (!result.ok) {
          throw new Error("Failed to load product!");
        }

        const product = (await result.json()).data as TProduct;

        setProduct(product);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load product!",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[min(600px,80dvh)] data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <DialogTitle>Product Information</DialogTitle>
          <DialogDescription>
            View complete information about this product
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              Loading product information...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : product ? (
          <ScrollArea className="max-h-[calc(min(600px,80vh)-115px)] overflow-hidden">
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Product Name
                </label>
                <p className="text-lg font-bold mt-1">{product.name}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Description
                </label>
                <p className="text-sm text-foreground mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Price
                  </label>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Stock Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {product.stock > 0
                        ? `${product.stock} units available`
                        : "Out of stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Created
                  </label>
                  <p className="text-xs sm:text-sm text-foreground mt-1">
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
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
                    {new Date(product.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Product ID
                </label>
                <p className="text-xs text-muted-foreground font-mono mt-1 break-all bg-muted/50 p-2 rounded">
                  {product.id}
                </p>
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
