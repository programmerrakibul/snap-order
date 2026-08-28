"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/actions/server/product.action";
import {
  productSchema,
  TProductInput,
  TProductOutput,
} from "@/schemas/product";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { DiscountType } from "@/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TProductInput, TProductOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryName: "",
      sku: "",
      stock: 0,
      minThreshold: 10,
      maxThreshold: 100,
      costPrice: 0,
      originalPrice: 0,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: TProductInput) => {
    setIsLoading(true);
    try {
      const result = await createProduct(data);

      if (result.success) {
        toast.success(result.message);

        form.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 md:py-12">
      <Card className="w-full border-0 shadow-md">
        <CardContent className="px-4 pb-8 sm:px-6 lg:pb-10">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product Name</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        disabled={isLoading}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                      />

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <FieldContent>
                      <Textarea
                        placeholder="Enter detailed product description"
                        {...field}
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
                        className="text-sm sm:text-base min-h-24 sm:min-h-28"
                      />

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="brand"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Brand</FieldLabel>
                      <FieldContent>
                        <Input
                          placeholder="Enter product brand (optional)"
                          {...field}
                          disabled={isLoading}
                          className="h-10 sm:h-11 text-sm sm:text-base"
                        />

                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="categoryName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category</FieldLabel>
                      <FieldContent>
                        <Input
                          placeholder="Enter category name"
                          {...field}
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="h-10 sm:h-11 text-sm sm:text-base"
                        />

                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="tags"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tags</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="Comma separated tags, e.g. electronics, premium"
                        {...field}
                        disabled={isLoading}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                      />

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="imageUrl"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Image URL</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="https://example.com/image.jpg (optional)"
                        {...field}
                        disabled={isLoading}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                      />

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-sm font-semibold mb-4 text-muted-foreground">
                  Initial Variant Details
                </p>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="sku"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>SKU</FieldLabel>
                          <FieldContent>
                            <Input
                              placeholder="SKU-6-12-CHARS"
                              {...field}
                              disabled={isLoading}
                              aria-invalid={fieldState.invalid}
                              className="h-10 sm:h-11 text-sm sm:text-base uppercase"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="attributes"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Attributes</FieldLabel>
                          <FieldContent>
                            <Input
                              placeholder='{"size":"L","color":"Red"}'
                              {...field}
                              disabled={isLoading}
                              className="h-10 sm:h-11 text-sm sm:text-base font-mono"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Controller
                      control={form.control}
                      name="stock"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Stock Quantity</FieldLabel>
                          <FieldContent>
                            <Input
                              type="number"
                              placeholder="0"
                              value={field.value as number}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={isLoading}
                              aria-invalid={fieldState.invalid}
                              className="h-10 sm:h-11 text-sm sm:text-base"
                              min="0"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="minThreshold"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Min Threshold</FieldLabel>
                          <FieldContent>
                            <Input
                              type="number"
                              placeholder="10"
                              value={field.value as number}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={isLoading}
                              aria-invalid={fieldState.invalid}
                              className="h-10 sm:h-11 text-sm sm:text-base"
                              min="0"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="maxThreshold"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Max Threshold</FieldLabel>
                          <FieldContent>
                            <Input
                              type="number"
                              placeholder="100"
                              value={field.value as number}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={isLoading}
                              aria-invalid={fieldState.invalid}
                              className="h-10 sm:h-11 text-sm sm:text-base"
                              min="1"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="costPrice"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Cost Price</FieldLabel>
                          <FieldContent>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={field.value as number}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                disabled={isLoading}
                                aria-invalid={fieldState.invalid}
                                className="h-10 sm:h-11 pl-7 text-sm sm:text-base"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="originalPrice"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Selling Price</FieldLabel>
                          <FieldContent>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={field.value as number}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                disabled={isLoading}
                                aria-invalid={fieldState.invalid}
                                className="h-10 sm:h-11 pl-7 text-sm sm:text-base"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="discountType"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Discount Type</FieldLabel>
                          <FieldContent>
                            <Select
                              value={field.value ?? "NONE"}
                              onValueChange={(value) =>
                                field.onChange(
                                  value === "NONE"
                                    ? undefined
                                    : (value as DiscountType),
                                )
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="h-10 sm:h-11 w-full text-sm sm:text-base">
                                <SelectValue placeholder="No discount" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NONE">
                                  No discount
                                </SelectItem>
                                <SelectItem value={DiscountType.PERCENTAGE}>
                                  Percentage (%)
                                </SelectItem>
                                <SelectItem value={DiscountType.FIXED}>
                                  Fixed amount ($)
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="discountValue"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Discount Value</FieldLabel>
                          <FieldContent>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={
                                field.value === undefined || field.value === null
                                  ? ""
                                  : (field.value as number)
                              }
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={isLoading}
                              className="h-10 sm:h-11 text-sm sm:text-base"
                              step="0.01"
                              min="0"
                            />

                            {fieldState.error && (
                              <FieldError>{fieldState.error.message}</FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 sm:pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductForm;
