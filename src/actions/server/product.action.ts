"use server";

import prisma from "@/lib/prisma";
import { productSchema, TProductInput } from "@/schemas/product";
import { BadRequestError, HttpError } from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";

export const createProduct = async (data: TProductInput) => {
  try {
    const validatedData = productSchema.parse(data);

    const existingProduct = await prisma.product.findUnique({
      where: { name: validatedData.name },
    });

    if (existingProduct) {
      return {
        success: false,
        message: "Product with this name already exists!",
        error: "PRODUCT_EXISTS",
      };
    }

    await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
      },
    });

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: "Product created successfully!",
    };
  } catch (error: unknown) {
    console.error("Error creating product:", error);

    return {
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getAllProducts = async () => {
  "use cache";
  cacheLife("weeks");

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  } catch (error: unknown) {
    console.error(
      "Error fetching products:",
      (error as Error | HttpError).message,
    );

    return [];
  }
};

export const getProductById = async (id: string) => {
  "use cache";
  cacheLife("weeks");

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestError("Product not found!");
    }

    return {
      ...product,
      price: Number(product.price),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch (error: unknown) {
    console.error(
      "Error fetching product: ",
      (error as Error | HttpError).message,
    );

    return null;
  }
};
