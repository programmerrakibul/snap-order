"use server";

import prisma from "@/lib/prisma";

export const getAllProducts = async () => {
  try {
    const result = await prisma.product.findMany();
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
