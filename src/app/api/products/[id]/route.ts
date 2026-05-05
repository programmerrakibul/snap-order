import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { BadRequestError } from "http-errors-enhanced";

export const GET = async (
  _req: NextRequest,
  { params }: Promise<{ params: { id: string } }>,
) => {
  try {
    const { id } = await params;

    const result = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new BadRequestError("Product not found!");
    }

    const product = {
      ...result,
      price: Number(result.price),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Product fetched successfully!",
        data: product,
      },
      {
        status: 200,
      },
    );
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
