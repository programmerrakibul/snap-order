"use server";

import { OrderStatus, ProductStatus, RestockStatus, Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "./isAuthenticated";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getLastDays = (days: number) => {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    return date;
  });
};

const toDayKey = (date: Date) => startOfDay(date).toISOString().slice(0, 10);

const statusList = Object.values(OrderStatus);

export const getAdminOverviewData = async () => {
  const user = await isAuthenticated();

  if (!user || user.role !== Role.ADMIN) return null;

  const days = getLastDays(7);
  const fromDate = days[0];

  const [
    totalUsers,
    totalCustomers,
    activeVariants,
    lowStockVariants,
    pendingRestocks,
    orders,
    recentOrders,
    recentRestocks,
    topItems,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.productVariant.count({
      where: {
        isActive: true,
      },
    }),
    prisma.productVariant.count({
      where: {
        isActive: true,
        stock: {
          lte: prisma.productVariant.fields.minThreshold,
        },
      },
    }),
    prisma.restockRequest.count({
      where: {
        status: RestockStatus.PENDING,
      },
    }),
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: fromDate,
        },
      },
      select: {
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: true,
      },
    }),
    prisma.restockRequest.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            productVariant: {
              select: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productVariantId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const variantIds = topItems.map((item) => item.productVariantId);
  const variants = variantIds.length
    ? await prisma.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        select: {
          id: true,
          stock: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      })
    : [];

  const statusCounts = statusList.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const revenueByDay = days.map((date) => {
    const key = toDayKey(date);
    const dayOrders = orders.filter(
      (order) => toDayKey(order.createdAt) === key,
    );

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      value: dayOrders.reduce(
        (total, order) => total + order.totalAmount.toNumber(),
        0,
      ),
      orders: dayOrders.length,
    };
  });

  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalAmount.toNumber(),
    0,
  );
  const totalOrders = orders.length;
  const fulfilledOrders = orders.filter(
    (order) => order.status === OrderStatus.DELIVERED,
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalCustomers,
      totalProducts: activeVariants,
      activeProducts: activeVariants,
      lowStockProducts: lowStockVariants,
      pendingRestocks,
      fulfillmentRate: totalOrders
        ? Math.round((fulfilledOrders / totalOrders) * 100)
        : 0,
    },
    revenueByDay,
    statusCounts,
    topProducts: topItems.map((item) => {
      const variant = variants.find(
        (entry) => entry.id === item.productVariantId,
      );

      return {
        id: item.productVariantId,
        name: variant?.product.name ?? "Unknown product",
        stock: variant?.stock ?? 0,
        sold: item._sum.quantity ?? 0,
      };
    }),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.user.name || order.user.email,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      items: order.items.length,
      createdAt: order.createdAt.toISOString(),
    })),
    recentRestocks: recentRestocks.map((request) => ({
      id: request.id,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      items: request.items.length,
      quantity: request.items.reduce((total, item) => total + item.quantity, 0),
      products: request.items
        .slice(0, 2)
        .map((item) => item.productVariant.product.name)
        .join(", "),
    })),
  };
};

export const getUserOverviewData = async () => {
  const user = await isAuthenticated();

  if (!user) return null;

  const days = getLastDays(7);
  const fromDate = days[0];

  const [orders, recentOrders, availableVariants, recentVariants] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: fromDate,
          },
        },
        select: {
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: {
          userId: user.id,
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              productVariant: {
                select: {
                  product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.productVariant.count({
        where: {
          isActive: true,
          stock: {
            gt: 0,
          },
          product: {
            status: ProductStatus.ACTIVE,
          },
        },
      }),
      prisma.productVariant.findMany({
        where: {
          isActive: true,
          stock: {
            gt: 0,
          },
          product: {
            status: ProductStatus.ACTIVE,
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          originalPrice: true,
          stock: true,
          createdAt: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  const statusCounts = statusList.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const spendingByDay = days.map((date) => {
    const key = toDayKey(date);
    const dayOrders = orders.filter(
      (order) => toDayKey(order.createdAt) === key,
    );

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      value: dayOrders.reduce(
        (total, order) => total + order.totalAmount.toNumber(),
        0,
      ),
      orders: dayOrders.length,
    };
  });

  const totalSpent = orders.reduce(
    (total, order) => total + order.totalAmount.toNumber(),
    0,
  );
  const totalOrders = orders.length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalSpent,
      totalOrders,
      pendingOrders: orders.filter(
        (order) => order.status === OrderStatus.PENDING,
      ).length,
      deliveredOrders: orders.filter(
        (order) => order.status === OrderStatus.DELIVERED,
      ).length,
      availableProducts: availableVariants,
    },
    spendingByDay,
    statusCounts,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productName: item.productVariant.product.name,
        quantity: item.quantity,
      })),
    })),
    recentProducts: recentVariants.map((variant) => ({
      id: variant.id,
      name: variant.product.name,
      price: variant.originalPrice.toNumber(),
      stock: variant.stock,
      createdAt: variant.createdAt.toISOString(),
    })),
  };
};
