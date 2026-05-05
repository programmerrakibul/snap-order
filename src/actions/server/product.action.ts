"use server";

import prisma from "@/lib/prisma";
import { BadRequestError } from "http-errors-enhanced";

export const getAllProducts = async () => {
  try {
    const result = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const products = result.map((p) => {
      return {
        ...p,
        price: Number(p.price),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    return products;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    if (!id) {
      throw new BadRequestError("Product id is required!");
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
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
  } catch (error) {
    console.error(error);

    throw error;
  }
};
