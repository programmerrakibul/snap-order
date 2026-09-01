"use client";

import {
  TCreateOrderInput,
  TCreateOrderOutput,
  createOrderSchema,
} from "@/schemas/order";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconLoader,
  IconShoppingCart,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserData from "@/hooks/useUserData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/server/order.action";
import { getDistricts, getDivisions, getUpazilas } from "@olism/bd-geo";

const DIVISIONS = getDivisions();
const DISTRICTS = getDistricts();
const UPAZILAS = getUpazilas();

export type TCheckoutVariant = {
  variantId: string;
  sku: string;
  productName: string;
  attributes: Record<string, string>;
  unitPrice: number;
  discountAmount: number | null;
  stock: number;
};

interface CheckoutFormProps {
  variant: TCheckoutVariant;
}

const CheckoutForm = ({ variant }: CheckoutFormProps) => {
  const { user } = useUserData();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setValue,
  } = useForm<TCreateOrderInput, unknown, TCreateOrderOutput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      items: [{ productVariantId: variant.variantId, quantity: 1 }],
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingArea: "",
      shippingThana: "",
      shippingDistrict: "",
      shippingDivision: "",
      shippingPostalCode: "",
      shippingNote: "",
      customerNote: "",
    },
  });

  const unitPrice = variant.discountAmount ?? variant.unitPrice;

  const watchedDivision = useWatch({
    control,
    name: "shippingDivision",
  });
  const watchedDistrict = useWatch({
    control,
    name: "shippingDistrict",
  });

  const activeDivision = DIVISIONS.find(
    (division) => division.name === watchedDivision,
  );
  const divisionDistricts = activeDivision
    ? DISTRICTS.filter((district) => district.divisionId === activeDivision.id)
    : [];
  const activeDistrict = divisionDistricts.find(
    (district) => district.name === watchedDistrict,
  );
  const districtUpazilas = activeDistrict
    ? UPAZILAS.filter((upazila) => upazila.districtId === activeDistrict.id)
    : [];

  const onSubmit = async (data: TCreateOrderOutput) => {
    if (!user) {
      toast.error("You must be signed in to place an order");
      return;
    }

    const item = data.items?.[0];
    if (!item) {
      toast.error("Product is missing");
      return;
    }

    try {
      const result = await createOrder({
        customerId: user.id,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        shippingArea: data.shippingArea,
        shippingThana: data.shippingThana,
        shippingDistrict: data.shippingDistrict,
        shippingDivision: data.shippingDivision,
        shippingPostalCode: data.shippingPostalCode || undefined,
        shippingNote: data.shippingNote || undefined,
        customerNote: data.customerNote || undefined,
        items: [
          {
            productVariantId: item.productVariantId,
            quantity: Number(item.quantity),
          },
        ],
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/orders");
      } else {
        toast.error(result.error || result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start"
    >
      {/* Shipping details */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="shippingName"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor="shippingName" className="font-medium">
                      Recipient Name
                    </FieldLabel>
                    <Input
                      id="shippingName"
                      type="text"
                      placeholder="Full name of recipient"
                      disabled={isSubmitting}
                      aria-invalid={invalid}
                      {...field}
                    />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              <Controller
                name="shippingPhone"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor="shippingPhone" className="font-medium">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="shippingPhone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      disabled={isSubmitting}
                      aria-invalid={invalid}
                      {...field}
                    />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="shippingAddress"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel
                      htmlFor="shippingAddress"
                      className="font-medium"
                    >
                      Street Address
                    </FieldLabel>
                    <Input
                      id="shippingAddress"
                      type="text"
                      placeholder="House, Road, Village/Colony"
                      disabled={isSubmitting}
                      aria-invalid={invalid}
                      {...field}
                    />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="shippingArea"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor="shippingArea" className="font-medium">
                        Area
                      </FieldLabel>
                      <Input
                        id="shippingArea"
                        type="text"
                        placeholder="Area / Locality"
                        disabled={isSubmitting}
                        aria-invalid={invalid}
                        {...field}
                      />
                      {error && <FieldError>{error.message}</FieldError>}
                    </Field>
                  )}
                />

                <Controller
                  name="shippingPostalCode"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Field data-invalid={invalid}>
                      <FieldLabel
                        htmlFor="shippingPostalCode"
                        className="font-medium"
                      >
                        Postal Code{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </FieldLabel>
                      <Input
                        id="shippingPostalCode"
                        type="text"
                        inputMode="numeric"
                        placeholder="Postal code"
                        disabled={isSubmitting}
                        aria-invalid={invalid}
                        {...field}
                      />
                      {error && <FieldError>{error.message}</FieldError>}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="shippingDivision"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor="shippingDivision" className="font-medium">
                        Division
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue("shippingDistrict", "");
                          setValue("shippingThana", "");
                        }}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="shippingDivision"
                          className="w-full"
                          aria-invalid={invalid}
                        >
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIVISIONS.map((division) => (
                            <SelectItem
                              key={division.id}
                              value={division.name}
                            >
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && <FieldError>{error.message}</FieldError>}
                    </Field>
                  )}
                />

                <Controller
                  name="shippingDistrict"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Field data-invalid={invalid}>
                      <FieldLabel
                        htmlFor="shippingDistrict"
                        className="font-medium"
                      >
                        District
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue("shippingThana", "");
                        }}
                        disabled={isSubmitting || !activeDivision}
                      >
                        <SelectTrigger
                          id="shippingDistrict"
                          className="w-full"
                          aria-invalid={invalid}
                        >
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisionDistricts.map((district) => (
                            <SelectItem
                              key={district.id}
                              value={district.name}
                            >
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && <FieldError>{error.message}</FieldError>}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="shippingThana"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor="shippingThana" className="font-medium">
                      Thana / Upazila
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || !activeDistrict}
                    >
                      <SelectTrigger
                        id="shippingThana"
                        className="w-full"
                        aria-invalid={invalid}
                      >
                        <SelectValue placeholder="Select thana / upazila" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtUpazilas.map((upazila) => (
                          <SelectItem
                            key={upazila.id}
                            value={upazila.name}
                          >
                            {upazila.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="shippingNote"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel
                      htmlFor="shippingNote"
                      className="font-medium"
                    >
                      Delivery Note{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Textarea
                      id="shippingNote"
                      placeholder="Any special delivery instructions"
                      disabled={isSubmitting}
                      aria-invalid={invalid}
                      {...field}
                    />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              <Controller
                name="customerNote"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel
                      htmlFor="customerNote"
                      className="font-medium"
                    >
                      Customer Note{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Textarea
                      id="customerNote"
                      placeholder="Anything we should know?"
                      disabled={isSubmitting}
                      aria-invalid={invalid}
                      {...field}
                    />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconShoppingCart className="h-4 w-4" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border p-3">
              <p className="truncate text-sm font-medium">{variant.productName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {Object.values(variant.attributes).length > 0
                  ? Object.values(variant.attributes).join(" / ")
                  : variant.sku}
              </p>

              <Controller
                name="items.0.quantity"
                control={control}
                render={({ field }) => {
                  const current =
                    Number.isNaN(Number(field.value)) || !field.value
                      ? 1
                      : Math.max(1, Number(field.value));
                  const lineTotal = unitPrice * current;

                  return (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7"
                            onClick={() =>
                              field.onChange(Math.max(current - 1, 1))
                            }
                            disabled={current <= 1 || isSubmitting}
                            aria-label="Decrease quantity"
                          >
                            <IconChevronDown className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {current}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7"
                            onClick={() =>
                              field.onChange(
                                Math.min(current + 1, variant.stock),
                              )
                            }
                            disabled={
                              current >= variant.stock || isSubmitting
                            }
                            aria-label="Increase quantity"
                          >
                            <IconChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ৳{lineTotal.toFixed(2)}
                          </p>
                          {variant.discountAmount ? (
                            <p className="text-xs text-muted-foreground line-through">
                              ৳{(variant.unitPrice * current).toFixed(2)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {variant.stock} in stock · ৳{unitPrice.toFixed(2)} / unit
                      </p>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ৳{lineTotal.toFixed(2)}
                        </span>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || variant.stock <= 0}
                        className="w-full mt-4"
                      >
                        {isSubmitting ? (
                          <>
                            <IconLoader className="mr-2 animate-spin" />
                            <span>Placing Order...</span>
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </>
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default CheckoutForm;