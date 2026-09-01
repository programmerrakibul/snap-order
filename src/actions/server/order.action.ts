"use server";

import { OrderStatus, ProductStatus, Role } from "@/generated/prisma/enums";
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
    const {
      customerId,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingArea,
      shippingThana,
      shippingDistrict,
      shippingDivision,
      shippingPostalCode,
      shippingNote,
      customerNote,
      items,
    } = input;

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

        const discountAmount = variant.discountAmount?.toNumber() ?? null;

        orderItemsData.push({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          totalPrice: subtotal.toFixed(2),
          discountAmount: discountAmount !== null ? discountAmount.toFixed(2) : null,
        });
      }

      await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          customerId,
          shippingName,
          shippingPhone,
          shippingAddress,
          shippingArea,
          shippingThana,
          shippingDistrict,
          shippingDivision,
          shippingPostalCode: shippingPostalCode || null,
          shippingNote: shippingNote || null,
          customerNote: customerNote || null,
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
      customerId: user.role === Role.ADMIN ? undefined : user.id,
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
        customer: {
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
      cancelledAt: order.cancelledAt?.toISOString() ?? null,
      confirmedAt: order.confirmedAt?.toISOString() ?? null,
      shippedAt: order.shippedAt?.toISOString() ?? null,
      deliveredAt: order.deliveredAt?.toISOString() ?? null,
      items: order.items.map((item) => ({
        ...item,
        totalPrice: Number(item.totalPrice),
        discountAmount: item.discountAmount ? Number(item.discountAmount) : null,
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

    const statusUpdate: Record<string, unknown> = {
      status: newStatus,
    };

    if (newStatus === OrderStatus.CONFIRMED) {
      statusUpdate.confirmedAt = new Date();
    } else if (newStatus === OrderStatus.SHIPPED) {
      statusUpdate.shippedAt = new Date();
    } else if (newStatus === OrderStatus.DELIVERED) {
      statusUpdate.deliveredAt = new Date();
    } else if (newStatus === OrderStatus.CANCELLED) {
      statusUpdate.cancelledAt = new Date();
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: statusUpdate,
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
        customerId: user.role === Role.ADMIN ? undefined : user.id,
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

export const getCheckoutData = async (variantId: string) => {
  try {
    const user = await isAuthenticated();

    if (!user) return null;

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        sku: true,
        attributes: true,
        stock: true,
        originalPrice: true,
        discountAmount: true,
        discountType: true,
        discountValue: true,
        product: {
          select: {
            id: true,
            name: true,
            status: true,
            slug: true,
            variants: {
              where: { isActive: true },
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                sku: true,
                attributes: true,
                stock: true,
                originalPrice: true,
                discountAmount: true,
              },
            },
          },
        },
      },
    });

    if (!variant) return null;
    if (variant.product.status !== ProductStatus.ACTIVE) return null;

    return {
      productId: variant.product.id,
      productName: variant.product.name,
      productSlug: variant.product.slug,
      selected: {
        variantId: variant.id,
        productName: variant.product.name,
        sku: variant.sku,
        attributes: (variant.attributes ?? {}) as Record<string, string>,
        unitPrice: Number(variant.originalPrice),
        discountAmount: variant.discountAmount
          ? Number(variant.discountAmount)
          : null,
        stock: variant.stock,
      },
      variants: variant.product.variants.map((v) => ({
        variantId: v.id,
        sku: v.sku,
        attributes: (v.attributes ?? {}) as Record<string, string>,
        unitPrice: Number(v.originalPrice),
        discountAmount: v.discountAmount ? Number(v.discountAmount) : null,
        stock: v.stock,
      })),
    };
  } catch (error: unknown) {
    console.error("Error fetching checkout data: ", error);
    return null;
  }
};
