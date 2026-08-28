"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProduct,
  updateProduct,
} from "@/actions/server/product.action";
import {
  productSchema,
  TProductInput,
  TProductOutput,
} from "@/schemas/product";
import { generateSlug } from "@/lib/slug";
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
import { IconLoader, IconPlus, IconTrash } from "@tabler/icons-react";
import { TCategory, TProduct } from "@/types";
import SlugInput from "@/components/shared/slug-input";
import ImageUpload from "@/components/shared/image-upload";
import VariantFields from "./variant-fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProductFormProps {
  categories: TCategory[];
  product?: TProduct | null;
}

const MAX_VARIANTS = 10;
const MAX_IMAGES = 6;

const AddProductForm = ({ categories, product }: AddProductFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(product);
  const [categoryMode, setCategoryMode] = useState<"select" | "new">(() =>
    product
      ? "select"
      : categories.length > 0
        ? "select"
        : "new",
  );

  const form = useForm<TProductInput, unknown, TProductOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      slug: product?.slug ?? "",
      brand: product?.brand ?? "",
      categoryName: product?.category.name ?? "",
      tags: product?.tags.join(", ") ?? "",
      imageUrls:
        product && product.images.length > 0
          ? product.images.map((image) => ({ url: image.url }))
          : [{ url: "" }],
      variants:
        product && product.variants.length > 0
          ? product.variants.map((variant) => ({
              variantId: variant.id,
              sku: variant.sku,
              attributeRows: Object.entries(variant.attributes).map(
                ([key, value]) => ({ key, value }),
              ),
              stock: variant.stock,
              minThreshold: variant.minThreshold,
              maxThreshold: variant.maxThreshold,
              costPrice: variant.costPrice,
              originalPrice: variant.originalPrice,
              discountType: variant.discountType ?? undefined,
              discountValue: variant.discountValue ?? undefined,
              supplierId: "",
            }))
          : [
              {
                sku: "",
                attributeRows: [{ key: "", value: "" }],
                stock: 0,
                minThreshold: 10,
                maxThreshold: 100,
                costPrice: 0,
                originalPrice: 0,
                supplierId: "",
              },
            ],
    },
    mode: "onBlur",
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const watchedSlug = useWatch({ control: form.control, name: "slug" });
  const imageUrlsError =
    form.formState.errors.imageUrls?.message ||
    form.formState.errors.imageUrls?.root?.message;
  const variantsError =
    form.formState.errors.variants?.message ||
    form.formState.errors.variants?.root?.message;

  useEffect(() => {
    if (isEditing) return;

    const auto = generateSlug(watchedName);

    if (auto && !watchedSlug) {
      form.setValue("slug", auto, { shouldValidate: false });
    }
  }, [watchedName, watchedSlug, isEditing, form]);

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control: form.control, name: "variants" });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
    update: updateImage,
  } = useFieldArray({ control: form.control, name: "imageUrls" });

  const onSubmit = async (data: TProductInput) => {
    setIsLoading(true);

    try {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (result.success) {
        toast.success(result.message);

        if (product) {
          router.push("/dashboard/products");
        } else {
          form.reset();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardContent>
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
                name="slug"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Slug</FieldLabel>
                    <FieldContent>
                      <SlugInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={isLoading}
                        invalid={fieldState.invalid}
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
                        {categoryMode === "select" && categories.length > 0 ? (
                          <>
                            <Select
                              value={field.value || "none"}
                              onValueChange={(value) => {
                                if (value === "__create__") {
                                  setCategoryMode("new");
                                  field.onChange("");
                                  return;
                                }

                                field.onChange(
                                  value === "none" ? "" : value,
                                );
                              }}
                              disabled={isLoading}
                            >
                              <SelectTrigger className="h-10 sm:h-11 w-full text-sm sm:text-base">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">
                                  Select a category
                                </SelectItem>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.name}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="__create__">
                                  <span className="inline-flex items-center gap-1.5">
                                    <IconPlus className="h-3.5 w-3.5" />
                                    Create new category
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <button
                              type="button"
                              onClick={() => setCategoryMode("new")}
                              disabled={isLoading}
                              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                              <IconPlus className="h-3.5 w-3.5" />
                              Or create a new category
                            </button>
                          </>
                        ) : (
                          <>
                            <Input
                              placeholder="Enter category name"
                              {...field}
                              disabled={isLoading}
                              aria-invalid={fieldState.invalid}
                              className="h-10 sm:h-11 text-sm sm:text-base"
                            />

                            {categories.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCategoryMode("select");
                                  field.onChange("");
                                }}
                                disabled={isLoading}
                                className="mt-2 text-sm font-medium text-primary hover:underline"
                              >
                                Pick an existing category
                              </button>
                            )}
                          </>
                        )}

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
            </FieldGroup>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Product Images
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading || imageFields.length >= MAX_IMAGES}
                    onClick={() => appendImage({ url: "" })}
                  >
                    <IconPlus className="h-4 w-4" />
                    Add image
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="space-y-2">
                      {index === 0 && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Primary image
                        </span>
                      )}

                      <ImageUpload
                        value={field.url}
                        onChange={(url) => updateImage(index, { url })}
                        folder="products"
                        disabled={isLoading}
                      />

                      {imageFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => removeImage(index)}
                          className="h-8 px-2 text-destructive hover:bg-destructive/10"
                        >
                          <IconTrash className="h-4 w-4" />
                          Remove image
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {imageUrlsError && <FieldError>{imageUrlsError}</FieldError>}

                <p className="mt-2 text-xs text-muted-foreground">
                  At least one image is required. The first image is used as the
                  primary one.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Variants
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading || variantFields.length >= MAX_VARIANTS}
                    onClick={() =>
                      appendVariant({
                        sku: "",
                        attributeRows: [{ key: "", value: "" }],
                        stock: 0,
                        minThreshold: 10,
                        maxThreshold: 100,
                        costPrice: 0,
                        originalPrice: 0,
                        supplierId: "",
                      })
                    }
                  >
                    <IconPlus className="h-4 w-4" />
                    Add variant
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {variantFields.map((field, index) => (
                    <VariantFields
                      key={field.id}
                      control={form.control}
                      index={index}
                      isLoading={isLoading}
                      canRemove={variantFields.length > 1}
                      onRemove={() => removeVariant(index)}
                    />
                  ))}
                </div>

                {variantsError && <FieldError>{variantsError}</FieldError>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 sm:pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : isEditing ? (
                  "Update Product"
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