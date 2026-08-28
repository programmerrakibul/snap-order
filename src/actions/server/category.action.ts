"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { generateSlug, uniqueSlug } from "@/lib/slug";
import { categorySchema } from "@/schemas/category";
import { TCategory } from "@/types";
import { cacheLife, revalidatePath } from "next/cache";
import { isAuthenticated } from "./isAuthenticated";

const serializeCategory = (
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: { products: number };
  },
): TCategory => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  image: category.image,
  productCount: category._count.products,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
});

export const getAllCategories = async (): Promise<TCategory[]> => {
  "use cache";
  cacheLife("weeks");

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return categories.map(serializeCategory);
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    return [];
  }
};

export const createCategory = async (data: unknown) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    const validatedData = categorySchema.parse(data);

    const existingCategory = await prisma.category.findFirst({
      where: { name: validatedData.name },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "A category with this name already exists!",
        error: "CATEGORY_EXISTS",
      };
    }

    const requestedSlug = generateSlug(
      validatedData.slug ?? validatedData.name,
    );
    const slugExists = await prisma.category.findFirst({
      where: { slug: requestedSlug },
    });
    const slug = slugExists ? uniqueSlug(requestedSlug) : requestedSlug;

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        image: validatedData.image?.trim() || null,
      },
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/add-products");

    return {
      success: true,
      message: "Category created successfully!",
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
      },
    };
  } catch (error: unknown) {
    console.error("Error creating category:", error);

    return {
      success: false,
      message: "Failed to create category!",
    };
  }
};

export const updateCategory = async (categoryId: string, data: unknown) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    const validatedData = categorySchema.parse(data);

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        id: { not: categoryId },
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "A category with this name already exists!",
        error: "CATEGORY_EXISTS",
      };
    }

    let slug: string | undefined;

    if (validatedData.slug) {
      slug = generateSlug(validatedData.slug);

      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: categoryId },
        },
      });

      if (slugExists) {
        slug = uniqueSlug(slug);
      }
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        slug,
        image: validatedData.image?.trim() || null,
      },
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/add-products");

    return {
      success: true,
      message: "Category updated successfully!",
    };
  } catch (error: unknown) {
    console.error("Error updating category:", error);

    return {
      success: false,
      message: "Failed to update category!",
    };
  }
};