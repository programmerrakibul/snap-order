import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  ProductStatus,
  RestockStatus,
  type RestockRequestItem,
} from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  return await handleRestock(req);
}

export async function POST(req: NextRequest) {
  return await handleRestock(req);
}

async function handleRestock(req: NextRequest) {
  const cronSecret = req.headers.get("authorization");
  const isCronRequest = cronSecret === `Bearer ${process.env.CRON_SECRET}`;

  if (!isCronRequest) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    );
  }

  try {
    const restockItemIds = await prisma.restockRequestItem.findMany({
      where: {
        restockRequest: {
          status: RestockStatus.PENDING,
        },
      },
      select: {
        productVariantId: true,
      },
    });

    const res = await prisma.productVariant.findMany({
      where: {
        isActive: true,
        stock: {
          lte: prisma.productVariant.fields.minThreshold,
        },
        product: {
          status: ProductStatus.ACTIVE,
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
      (
        acc: Pick<RestockRequestItem, "productVariantId" | "quantity">[],
        variant,
      ) => {
        const { stock, minThreshold, maxThreshold, id: variantId } = variant;

        if (
          !restockItemIds.some(
            (item) => item.productVariantId === variantId,
          ) &&
          stock < minThreshold
        ) {
          const quantity = maxThreshold - stock;

          acc.push({
            productVariantId: variantId,
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
    });

    revalidatePath("/dashboard/restock-products");
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        success: true,
        message: "Restock check successful!",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error("Error checking restock status: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check restock status!",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      },
    );
  }
}
