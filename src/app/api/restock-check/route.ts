import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  RestockStatus,
  type RestockRequestItem,
} from "@/generated/prisma/client";

export const POST = async () => {
  try {
    const restockItemsId = await prisma.restockRequestItem.findMany({
      where: {
        restockRequest: {
          status: RestockStatus.PENDING,
        },
      },
      select: {
        productId: true,
      },
    });

    const res = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: prisma.product.fields.minThreshold,
        },
      },
      select: {
        id: true,
        stock: true,
        minThreshold: true,
        maxThreshold: true,
      },
    });

    const items = res.reduce(
      (acc: Pick<RestockRequestItem, "productId" | "quantity">[], product) => {
        const { stock, minThreshold, maxThreshold, id: productId } = product;

        if (
          !restockItemsId.some((item) => item.productId === productId) &&
          stock < minThreshold
        ) {
          const quantity = maxThreshold - stock;

          acc.push({
            productId,
            quantity,
          });
        }

        return acc;
      },
      [],
    );

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No products need restocking",
      });
    }

    await prisma.restockRequest.create({
      data: {
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Restock check successful!",
    });
  } catch (error: unknown) {
    console.error("Error checking restock status: ", error);

    return NextResponse.json({
      success: false,
      message: "Failed to check restock status!",
    });
  }
};
