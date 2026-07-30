"use server";

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
            product: true,
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
        product: {
          name: item.product.name,
          stock: item.product.stock,
          minThreshold: item.product.minThreshold,
          maxThreshold: item.product.maxThreshold,
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
            product: true,
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
        product: {
          name: item.product.name,
          stock: item.product.stock,
          minThreshold: item.product.minThreshold,
          maxThreshold: item.product.maxThreshold,
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
    productId: string;
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

    const updateProductStockPromises = items.map(({ productId, quantity }) =>
      prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity }, lastRestockedAt: new Date() },
      }),
    );

    await Promise.all(updateProductStockPromises);

    const today = new Date();
    await prisma.restockRequest.update({
      where: { id: requestId },
      data: {
        status: RestockStatus.APPROVED,
        approvedAt: today,
        stockedById: user.id,
      },
    });

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
