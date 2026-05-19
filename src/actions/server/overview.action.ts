"use server";

import prisma from "@/lib/prisma";
import { OrderStatus, RestockStatus, Role } from "@/generated/prisma/enums";
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
    totalProducts,
    activeProducts,
    lowStockProducts,
    pendingRestocks,
    orders,
    recentOrders,
    recentRestocks,
    topItems,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: {
          lte: prisma.product.fields.minThreshold,
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
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
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

  const productIds = topItems.map((item) => item.productId);
  const products = productIds.length
    ? await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
      })
    : [];

  const statusCounts = statusList.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const revenueByDay = days.map((date) => {
    const key = toDayKey(date);
    const dayOrders = orders.filter((order) => toDayKey(order.createdAt) === key);

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
      totalProducts,
      activeProducts,
      lowStockProducts,
      pendingRestocks,
      fulfillmentRate: totalOrders
        ? Math.round((fulfilledOrders / totalOrders) * 100)
        : 0,
    },
    revenueByDay,
    statusCounts,
    topProducts: topItems.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      return {
        id: item.productId,
        name: product?.name ?? "Unknown product",
        stock: product?.stock ?? 0,
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
        .map((item) => item.product.name)
        .join(", "),
    })),
  };
};

export const getUserOverviewData = async () => {
  const user = await isAuthenticated();

  if (!user) return null;

  const days = getLastDays(7);
  const fromDate = days[0];

  const [
    orders,
    recentOrders,
    availableProducts,
    recentProducts,
    unreadNotifications,
  ] = await Promise.all([
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
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: {
          gt: 0,
        },
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        createdAt: true,
      },
    }),
    prisma.notification?.count({
      where: {
        userId: user.id,
        read: false,
      },
    }),
  ]);

  const statusCounts = statusList.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const spendingByDay = days.map((date) => {
    const key = toDayKey(date);
    const dayOrders = orders.filter((order) => toDayKey(order.createdAt) === key);

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
      pendingOrders: orders.filter((order) => order.status === OrderStatus.PENDING)
        .length,
      deliveredOrders: orders.filter(
        (order) => order.status === OrderStatus.DELIVERED,
      ).length,
      availableProducts,
      unreadNotifications,
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
        productName: item.product.name,
        quantity: item.quantity,
      })),
    })),
    recentProducts: recentProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
      createdAt: product.createdAt.toISOString(),
    })),
  };
};
