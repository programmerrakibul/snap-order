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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TProductInput, TProductOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
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
        <CardHeader className="space-y-3 px-4 py-6 sm:px-6 sm:py-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Add New Product
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Fill in the details below to add a new product to your inventory
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-8 sm:px-6 lg:pb-10">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <FieldGroup>
              {/* Product Name Field */}
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

              {/* Description Field */}
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
                        className="text-sm sm:text-base min-h-24 sm:min-h-28"
                      />

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Price and Stock Row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Price Field */}
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Price</FieldLabel>
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

                {/* Stock Field */}
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
              </div>
            </FieldGroup>

            {/* Submit and Reset Buttons */}
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
