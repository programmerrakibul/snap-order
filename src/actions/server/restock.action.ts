"use server";

import { revalidatePath } from "next/cache";
import { RestockStatus, Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { TRestockRequest } from "@/types";
import { isAuthenticated } from "./isAuthenticated";

export const getRestockRequestItems = async (): Promise<TRestockRequest[]> => {
  try {
    const res = await prisma.restockRequest.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            productVariant: {
              select: {
                id: true,
                sku: true,
                stock: true,
                minThreshold: true,
                maxThreshold: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        stockedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const data = res.map((request) => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      approvedAt: request.approvedAt?.toISOString() || null,
      cancelledAt: request.cancelledAt?.toISOString() || null,
      items: request.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        productVariant: {
          sku: item.productVariant.sku,
          stock: item.productVariant.stock,
          minThreshold: item.productVariant.minThreshold,
          maxThreshold: item.productVariant.maxThreshold,
          productName: item.productVariant.product.name,
        },
      })),
    }));

    return data;
  } catch (error: unknown) {
    console.error("Error fetching restock request items: ", error);

    return [];
  }
};

export const getRestockRequestById = async (
  requestId: string,
): Promise<TRestockRequest | null> => {
  if (!requestId) {
    return null;
  }

  try {
    const request = await prisma.restockRequest.findUnique({
      where: { id: requestId },
      include: {
        items: {
          include: {
            productVariant: {
              select: {
                id: true,
                sku: true,
                stock: true,
                minThreshold: true,
                maxThreshold: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        stockedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!request) return null;

    return {
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      approvedAt: request.approvedAt?.toISOString() || null,
      cancelledAt: request.cancelledAt?.toISOString() || null,
      items: request.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        productVariant: {
          sku: item.productVariant.sku,
          stock: item.productVariant.stock,
          minThreshold: item.productVariant.minThreshold,
          maxThreshold: item.productVariant.maxThreshold,
          productName: item.productVariant.product.name,
        },
      })),
    };
  } catch (error: unknown) {
    console.error("Error fetching restock request details: ", error);
    return null;
  }
};

export const approveRestockRequest = async ({
  requestId,
  items,
}: {
  requestId: string;
  items: {
    productVariantId: string;
    quantity: number;
  }[];
}) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    const updateVariantStockPromises = items.map(
      ({ productVariantId, quantity }) =>
        prisma.productVariant.update({
          where: { id: productVariantId },
          data: { stock: { increment: quantity }, lastRestockedAt: new Date() },
        }),
    );

    await Promise.all(updateVariantStockPromises);

    const today = new Date();
    await prisma.restockRequest.update({
      where: { id: requestId },
      data: {
        status: RestockStatus.APPROVED,
        approvedAt: today,
        stockedById: user.id,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/restock-products");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Restock request approved successfully!",
    };
  } catch (error: unknown) {
    console.error("Error approving restock request: ", error);

    return {
      success: false,
      message: "Error approving restock request!",
    };
  }
};

export const cancelRestockRequest = async (requestId: string) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    await prisma.restockRequest.update({
      where: { id: requestId },
      data: {
        status: RestockStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/dashboard/restock-products");

    return {
      success: true,
      message: "Restock request cancelled successfully!",
    };
  } catch (error: unknown) {
    console.error("Error cancelling restock request: ", error);

    return {
      success: false,
      message: "Error cancelling restock request!",
    };
  }
};
