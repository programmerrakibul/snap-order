"use client";

import { TProductInput } from "@/schemas/product";
import { DiscountType } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldArrayPath,
  type Path,
} from "react-hook-form";

interface VariantFieldsProps {
  control: Control<TProductInput>;
  index: number;
  isLoading?: boolean;
  canRemove: boolean;
  onRemove: () => void;
}

const VariantFields = ({
  control,
  index,
  isLoading,
  canRemove,
  onRemove,
}: VariantFieldsProps) => {
  const path = (field: string) =>
    `variants.${index}.${field}` as Path<TProductInput>;

  const {
    fields: attributeRows,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: `variants.${index}.attributeRows` as FieldArrayPath<TProductInput>,
  });

  return (
    <div className="relative rounded-lg border border-border bg-muted/10 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Variant {index + 1}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLoading || !canRemove}
          onClick={onRemove}
          className="h-8 px-2 text-destructive hover:bg-destructive/10"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name={path("sku")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">SKU</label>
                <Input
                  placeholder="SKU-6-12-CHARS"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                  className="h-10 sm:h-11 text-sm sm:text-base uppercase"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name={path("supplierId")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Supplier ID</label>
                <Input
                  placeholder="Leave empty if not set"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <div className="mb-2 space-y-1.5">
            <label className="text-sm font-medium">Attributes</label>
            <p className="text-xs text-muted-foreground">
              Optional name/value pairs, e.g. Size = M, Color = Red.
            </p>
          </div>

          <div className="space-y-2">
            {attributeRows.map((row, rowIndex) => (
              <div key={row.id} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={
                    path(`attributeRows.${rowIndex}.key`) as Path<TProductInput>
                  }
                  render={({ field }) => (
                    <Input
                      placeholder="Name (e.g. Size)"
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isLoading}
                      className="h-9 flex-1 text-sm"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={
                    path(`attributeRows.${rowIndex}.value`) as Path<TProductInput>
                  }
                  render={({ field }) => (
                    <Input
                      placeholder="Value (e.g. Medium)"
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isLoading}
                      className="h-9 flex-1 text-sm"
                    />
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  onClick={() => removeAttribute(rowIndex)}
                  className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => appendAttribute({ key: "", value: "" })}
            className="mt-2"
          >
            <IconPlus className="h-4 w-4" />
            Add attribute
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Controller
            control={control}
            name={path("stock")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Stock Quantity</label>
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
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name={path("minThreshold")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Min Threshold</label>
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
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name={path("maxThreshold")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Max Threshold</label>
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
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name={path("costPrice")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cost Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
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
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name={path("originalPrice")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Selling Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
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
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name={path("discountType")}
            render={({ field }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Discount Type</label>
                <Select
                  value={(field.value as DiscountType | undefined) ?? "NONE"}
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
                    <SelectItem value="NONE">No discount</SelectItem>
                    <SelectItem value={DiscountType.PERCENTAGE}>
                      Percentage (%)
                    </SelectItem>
                    <SelectItem value={DiscountType.FIXED}>
                      Fixed amount ($)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name={path("discountValue")}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Discount Value</label>
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
                  aria-invalid={fieldState.invalid}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  step="0.01"
                  min="0"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantFields;