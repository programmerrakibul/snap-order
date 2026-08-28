"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { cn } from "@/lib/utils";
import { TProduct, TProductVariant } from "@/types/product.interface";
import Image from "next/image";

interface ProductDetailModalProps {
  Trigger: React.ReactNode;
  product: TProduct;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function variantStatusBadge(variant: TProductVariant) {
  if (!variant.isActive) {
    return <Badge variant="destructive">Inactive</Badge>;
  }
  if (variant.stock <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }
  if (variant.stock <= variant.minThreshold) {
    return <Badge variant="secondary">Low stock</Badge>;
  }
  return <Badge variant="default">In stock</Badge>;
}

function variantPrice(variant: TProductVariant) {
  if (variant.discountAmount == null) {
    return (
      <>
        <span className="text-lg font-bold">
          ${variant.originalPrice.toFixed(2)}
        </span>
      </>
    );
  }

  const type = variant.discountType;

  const discounted =
    type === "PERCENTAGE"
      ? variant.originalPrice * (1 - variant.discountValue! / 100)
      : Math.max(0, variant.originalPrice - variant.discountValue!);

  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-lg font-bold text-primary">
        ${discounted.toFixed(2)}
      </span>
      <span className="text-sm text-muted-foreground line-through">
        ${variant.originalPrice.toFixed(2)}
      </span>
      <Badge variant="secondary">
        {type === "PERCENTAGE"
          ? `${variant.discountValue}% off`
          : `-$${variant.discountValue!.toFixed(2)}`}
      </Badge>
    </span>
  );
}

export default function ProductDetailModal({
  Trigger,
  product,
}: ProductDetailModalProps) {
  const activeVariants = product.variants.filter((v) => v.isActive);

  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-2xl xl:max-w-3xl w-full max-h-[min(600px,80dvh)] data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <DialogTitle>Product Information</DialogTitle>
          <DialogDescription>
            View complete information about this product
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(min(600px,80vh)-115px)] overflow-hidden">
          <div className="flex flex-col gap-6">
            {product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-muted">
                        <Image
                          src={image.url}
                          alt={image.altText || product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 sm:-left-12" />
                <CarouselNext className="-right-4 sm:-right-12" />
              </Carousel>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground">
                No images available
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Product Name
              </label>
              <p className="text-lg font-bold mt-1">{product.name}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.brand && (
                <Badge variant="outline">Brand: {product.brand}</Badge>
              )}
              {product.category && (
                <Badge variant="outline">{product.category.name}</Badge>
              )}
              <Badge
                variant={
                  product.status === "ACTIVE"
                    ? "default"
                    : product.status === "OUT_OF_STOCK"
                      ? "destructive"
                      : "secondary"
                }
              >
                {product.status.replace(/_/g, " ")}
              </Badge>
              {product.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <Separator />

            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Description
              </label>
              <p className="text-sm text-foreground mt-2 leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </div>

            {product.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

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

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground">
                  Variants
                </label>
                <Badge variant="outline">{activeVariants.length} active</Badge>
              </div>

              {product.variants.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-3">
                  No variants for this product.
                </p>
              ) : (
                <div className="flex flex-col gap-3 mt-3">
                  {product.variants.map((variant) => (
                    <Card
                      key={variant.id}
                      className={cn("p-4", !variant.isActive && "opacity-60")}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                            {variant.sku}
                          </span>
                          {variantStatusBadge(variant)}
                        </div>
                        {variantPrice(variant)}
                      </div>

                      {Object.keys(variant.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {Object.entries(variant.attributes).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="space-x-1"
                              >
                                <span className="capitalize">{key}:</span>
                                <span>{value}</span>
                              </Badge>
                            ),
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Stock
                          </label>
                          <p className="font-medium mt-0.5">{variant.stock}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Min Threshold
                          </label>
                          <p className="font-medium mt-0.5">
                            {variant.minThreshold}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Max Threshold
                          </label>
                          <p className="font-medium mt-0.5">
                            {variant.maxThreshold}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Cost Price
                          </label>
                          <p className="font-medium mt-0.5">
                            ${variant.costPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {variant.lastRestockedAt && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Last restocked {formatDate(variant.lastRestockedAt)}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Created
                </label>
                <p className="text-xs sm:text-sm text-foreground mt-1">
                  {formatDate(product.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-xs sm:text-sm text-foreground mt-1">
                  {formatDate(product.updatedAt)}
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
      </DialogContent>
    </Dialog>
  );
}
