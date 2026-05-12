"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";
import { TCreateOrderInput, TOrderResponse } from "@/types/order.interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { BadRequestError, HttpError } from "http-errors-enhanced";

export const createOrder = async (
  input: TCreateOrderInput,
): Promise<TOrderResponse> => {
  try {
    const { userId, shippingAddress, items } = input;

    await prisma.$transaction(async (tx) => {
      // 1. Validate stock and get product details
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
        },
      });

      // 2. Check stock availability
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new BadRequestError(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          );
        }
      }

      // 3. Calculate total and prepare order items
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!;

        const subtotal = product.price.toNumber() * item.quantity;
        totalAmount += subtotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // 4. Create Order + OrderItems
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
      });

      // 5. Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
    });

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
