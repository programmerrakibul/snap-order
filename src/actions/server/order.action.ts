"use server";

import { OrderStatus, Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { TCreateOrderInput, TOrderResponse } from "@/types/order.interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { BadRequestError, HttpError } from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";
import { isAuthenticated } from "./isAuthenticated";

export const createOrder = async (
  input: TCreateOrderInput,
): Promise<TOrderResponse> => {
  try {
    const { userId, shippingAddress, items } = input;

    await prisma.$transaction(async (tx) => {
      const variants = await tx.productVariant.findMany({
        where: {
          id: { in: items.map((item) => item.productVariantId) },
          isActive: true,
        },
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      });

      for (const item of items) {
        const variant = variants.find(
          (v) => v.id === item.productVariantId,
        );

        if (!variant) {
          throw new BadRequestError(
            `Variant not found: ${item.productVariantId}`,
          );
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${variant.product.name} (${variant.sku}). Available: ${variant.stock}`,
          );
        }
      }

      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = variants.find(
          (v) => v.id === item.productVariantId,
        )!;

        const unitPrice = variant.discountAmount ?? variant.originalPrice;
        const subtotal = unitPrice.toNumber() * item.quantity;
        totalAmount += subtotal;

        orderItemsData.push({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          unitPrice,
        });
      }

      await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          userId,
          shippingAddress,
          totalAmount: totalAmount.toFixed(2),
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Order created successfully!",
    };
  } catch (error: unknown) {
    console.error("Create Order Error: ", error);

    let errorMessage = (error as Error | HttpError).message;

    if ((error as PrismaClientKnownRequestError).code === "P2002") {
      errorMessage = "Unique constraint violation!";
    } else if ((error as PrismaClientKnownRequestError).code === "P2025") {
      errorMessage = "Record not found!";
    }

    return {
      success: false,
      message: "Failed to create order!",
      error: errorMessage,
    };
  }
};

export const getAllOrders = async () => {
  "use cache: private";
  cacheLife("weeks");

  try {
    const user = await isAuthenticated();

    if (!user) return [];

    const where = {
      userId: user.role === Role.ADMIN ? undefined : user.id,
    };

    const res = await prisma.order.findMany({
      where,
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
                attributes: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const orders = res.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        productName: item.productVariant.product.name,
        variantSku: item.productVariant.sku,
        productVariantId: item.productVariantId,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    }));

    return orders;
  } catch (error: unknown) {
    console.error("Error fetching orders: ", error);
    return [];
  }
};

export const updateOrderStatusById = async (
  orderId: string,
  newStatus: OrderStatus,
) => {
  try {
    const user = await isAuthenticated();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized!",
      };
    }

    if (user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "Forbidden! Only admins can modify order status.",
      };
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/dashboard/orders");

    return {
      success: true,
      message: "Order status updated successfully!",
    };
  } catch (error: unknown) {
    console.error("Error updating order status: ", error);

    return {
      success: false,
      message: "Failed to update order status!",
    };
  }
};

export const deleteOrderById = async (orderId: string) => {
  try {
    const user = await isAuthenticated();

    if (!user)
      return {
        success: false,
        message: "Unauthorized!",
      };

    await prisma.order.delete({
      where: {
        id: orderId,
        userId: user.role === Role.ADMIN ? undefined : user.id,
      },
    });

    revalidatePath("/dashboard/orders");

    return {
      success: true,
      message: "Order deleted successfully!",
    };
  } catch (error: unknown) {
    console.error("Error deleting order: ", error);

    return {
      success: false,
      message: "Failed to delete order!",
    };
  }
};
