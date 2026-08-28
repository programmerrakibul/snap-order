"use client";

import {
  TCreateOrderInput,
  TCreateOrderOutput,
  createOrderSchema,
} from "@/schemas/order";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TProduct, TProductVariant } from "@/types/product.interface";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserData from "@/hooks/useUserData";
import { toast } from "sonner";
import { createOrder } from "@/actions/server/order.action";
import { Dispatch, SetStateAction } from "react";

interface OrderProductFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: TProduct;
  variant: TProductVariant;
}

const OrderProductForm = ({
  product,
  variant,
  setIsOpen,
}: OrderProductFormProps) => {
  const { user } = useUserData();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<TCreateOrderInput, unknown, TCreateOrderOutput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      quantity: 1,
      shippingAddress: "",
    },
  });

  const onSubmit = async (data: TCreateOrderOutput) => {
    if (!user || !product || !variant) {
      toast.error("User or product information is missing");
      return;
    }

    try {
      const result = await createOrder({
        userId: user.id,
        shippingAddress: data.shippingAddress,
        items: [
          {
            productVariantId: variant.id,
            quantity: data.quantity,
          },
        ],
      });

      if (result.success) {
        toast.success(result.message);
        reset();
        setIsOpen(false);
      } else {
        toast.error(result.error || result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="quantity"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="quantity" className="font-medium">
                Quantity
              </FieldLabel>
              <Input
                id="quantity"
                type="number"
                placeholder="10"
                min="1"
                max={variant.stock}
                disabled={isSubmitting}
                aria-invalid={invalid}
                {...field}
                value={field.value as number}
                onChange={(e) => field.onChange(e.target.value)}
              />

              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        <Controller
          name="shippingAddress"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="shippingAddress" className="font-medium">
                Shipping Address
              </FieldLabel>
              <Input
                id="shippingAddress"
                type="text"
                placeholder="102 Main St, New York, NY 10001"
                disabled={isSubmitting}
                aria-invalid={invalid}
                {...field}
              />

              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <IconLoader className="mr-2 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </form>
    </>
  );
};

export default OrderProductForm;
