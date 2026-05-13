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

interface OrderProductModalProps {
  Trigger: React.ReactNode;
  product: TProduct;
}

const OrderProductModal = ({ Trigger, product }: OrderProductModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="data-[state=open]:zoom-in-0! data-[state=open]:duration-600 max-w-md">
        <DialogHeader>
          <DialogTitle>Order Product</DialogTitle>
        </DialogHeader>

        {!product ? (
          <Card>
            <CardContent>
              <CardDescription>
                <DialogDescription className="text-destructive text-center">
                  Product not found or failed to load! Please try again later or
                  contact support if the issue persists.
                </DialogDescription>
              </CardDescription>
            </CardContent>
          </Card>
        ) : product.stock <= 0 ? (
          <Card>
            <CardContent>
              <CardDescription>
                <DialogDescription className="text-destructive text-center">
                  The product is currently out of stock. Please check back later
                  or contact support for more information.
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
                      <span>Price: ${product.price}</span>
                      <span>Stock: {product.stock}</span>
                    </DialogDescription>
                  </CardDescription>
                </CardHeader>
              </CardContent>
            </Card>

            <OrderProductForm product={product} setIsOpen={setIsOpen} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderProductModal;
