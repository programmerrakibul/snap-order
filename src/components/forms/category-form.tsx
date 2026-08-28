"use client";

import {
  createCategory,
  updateCategory,
} from "@/actions/server/category.action";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  TCategoryInput,
  TCategoryOutput,
} from "@/schemas/category";
import { generateSlug } from "@/lib/slug";
import { TCategory } from "@/types";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SlugInput from "@/components/shared/slug-input";
import ImageUpload from "@/components/shared/image-upload";

interface CategoryFormProps {
  category?: TCategory;
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TCategoryInput, unknown, TCategoryOutput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      image: category?.image ?? "",
    },
    mode: "onBlur",
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const watchedSlug = useWatch({ control: form.control, name: "slug" });

  useEffect(() => {
    if (category) return;

    const auto = generateSlug(watchedName);

    if (auto && !watchedSlug) {
      form.setValue("slug", auto, { shouldValidate: false });
    }
  }, [watchedName, watchedSlug, category, form]);

  const onSubmit = async (data: TCategoryOutput) => {
    setIsLoading(true);

    try {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-5 py-1"
      noValidate
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="e.g. Electronics"
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
          name="image"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category Image</FieldLabel>
              <FieldContent>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="categories"
                  disabled={isLoading}
                />

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <IconLoader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : category ? (
            "Update Category"
          ) : (
            "Add Category"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;