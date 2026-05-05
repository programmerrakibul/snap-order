import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
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

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully!",
      data: products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      {
        status: 500,
      },
    );
  }
};
