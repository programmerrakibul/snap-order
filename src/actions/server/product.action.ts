"use server";

import prisma from "@/lib/prisma";
import { productSchema, TProductInput } from "@/schemas/product";
import { revalidatePath } from "next/cache";

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

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
      },
    });

    revalidatePath("/dashboard/products");

    console.log({
      ...product,
      price: Number(product.price),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });

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
