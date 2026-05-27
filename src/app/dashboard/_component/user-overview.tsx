import { getUserOverviewData } from "@/actions/server/overview.action";
import { MetricCard } from "@/components/cards/metric-card";
import Container from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBreakdown } from "@/components/ui/status-breakdown";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBox,
  IconChartBar,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconPackage,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

const UserOverview = async () => {
  const data = await getUserOverviewData();

  if (!data) return null;

  const { summary, spendingByDay, statusCounts, recentOrders, recentProducts } =
    data;

  return (
    <section className="py-8">
      <Container>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="7-day spend"
              value={money.format(summary.totalSpent)}
              detail={`${number.format(summary.totalOrders)} recent orders`}
              icon={IconCurrencyDollar}
              tone="bg-emerald-500/10 text-emerald-600"
            />
            <MetricCard
              title="Pending orders"
              value={number.format(summary.pendingOrders)}
              detail="Orders waiting for confirmation"
              icon={IconClock}
              tone="bg-amber-500/10 text-amber-600"
            />
            <MetricCard
              title="Delivered"
              value={number.format(summary.deliveredOrders)}
              detail="Completed in the last 7 days"
              icon={IconCheck}
              tone="bg-sky-500/10 text-sky-600"
            />
            <MetricCard
              title="Available products"
              value={number.format(summary.availableProducts)}
              detail={`${number.format(summary.availableProducts)} products available to order.`}
              icon={IconPackage}
              tone="bg-violet-500/10 text-violet-600"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
            <Card className="rounded-lg shadow-sm">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="size-5 text-primary" />
                    Spending Trend
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your order value over the last 7 days
                  </p>
                </div>
                <Badge variant="secondary">
                  {money.format(summary.totalSpent)}
                </Badge>
              </CardHeader>
              <CardContent>
                <BarChart data={spendingByDay} valuePrefix="$" />
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShoppingBag className="size-5 text-primary" />
                  Order Status
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your recent order mix
                </p>
              </CardHeader>
              <CardContent>
                <StatusBreakdown data={statusCounts} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="rounded-lg shadow-sm xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconBox className="size-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your latest purchases and statuses
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/orders">
                    View orders
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.length ? (
                    recentOrders.map((order) => {
                      const config = STATUS_CONFIG[order.status];
                      const firstItem = order.items[0];

                      return (
                        <div
                          key={order.id}
                          className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {firstItem
                                ? `${firstItem.productName} x ${firstItem.quantity}`
                                : "No items"}
                              {order.items.length > 1
                                ? ` + ${order.items.length - 1} more`
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <Badge
                              variant="outline"
                              className={cn("border", config.color)}
                            >
                              {config.label}
                            </Badge>
                            <p className="font-semibold">
                              {money.format(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      Your orders will appear here after checkout.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-lg shadow-sm">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <IconPackage className="size-5 text-primary" />
                      New Products
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fresh inventory ready to order
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/products">
                      Shop
                      <IconArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentProducts.length ? (
                      recentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {number.format(product.stock)} in stock
                            </p>
                          </div>
                          <p className="font-semibold">
                            {money.format(product.price)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No available products right now.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UserOverview;
