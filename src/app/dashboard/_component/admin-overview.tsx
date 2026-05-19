import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBox,
  IconChartBar,
  IconChecklist,
  IconCurrencyDollar,
  IconPackage,
  IconRefresh,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";
import { getAdminOverviewData } from "@/actions/server/overview.action";
import Container from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/cards/metric-card";
import { StatusBreakdown } from "@/components/ui/status-breakdown";
import { BarChart } from "@/components/ui/bar-chart";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

const AdminOverview = async () => {
  const data = await getAdminOverviewData();

  if (!data) return null;

  const {
    summary,
    revenueByDay,
    statusCounts,
    topProducts,
    recentOrders,
    recentRestocks,
  } = data;

  return (
    <section className="py-8">
      <Container>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="7-day revenue"
              value={money.format(summary.totalRevenue)}
              detail={`${number.format(summary.totalOrders)} orders captured`}
              icon={IconCurrencyDollar}
              tone="bg-emerald-500/10 text-emerald-600"
            />
            <MetricCard
              title="Customers"
              value={number.format(summary.totalCustomers)}
              detail={`${number.format(summary.totalUsers)} total accounts`}
              icon={IconUsers}
              tone="bg-sky-500/10 text-sky-600"
            />
            <MetricCard
              title="Inventory"
              value={number.format(summary.activeProducts)}
              detail={`${number.format(summary.lowStockProducts)} low-stock products`}
              icon={IconPackage}
              tone="bg-violet-500/10 text-violet-600"
            />
            <MetricCard
              title="Restock queue"
              value={number.format(summary.pendingRestocks)}
              detail={`${summary.fulfillmentRate}% delivered in 7 days`}
              icon={IconRefresh}
              tone="bg-amber-500/10 text-amber-600"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
            <Card className="rounded-lg shadow-sm">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="size-5 text-primary" />
                    Revenue Trend
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Last 7 days, refreshed from live orders
                  </p>
                </div>
                <Badge variant="secondary">
                  {money.format(summary.totalRevenue)}
                </Badge>
              </CardHeader>
              <CardContent>
                <BarChart data={revenueByDay} valuePrefix="$" />
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChecklist className="size-5 text-primary" />
                  Order Status
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution across this week&apos;s orders
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
                    <IconShoppingCart className="size-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Latest customer activity
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
                              {order.customer} &middot; {order.items} item
                              {order.items === 1 ? "" : "s"}
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
                      No orders have been placed yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBox className="size-5 text-primary" />
                  Top Products
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Most ordered items
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.length ? (
                    topProducts.map((product) => (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {number.format(product.stock)} in stock
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {number.format(product.sold)} sold
                          </Badge>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${Math.max(
                                (product.sold /
                                  Math.max(
                                    ...topProducts.map((item) => item.sold),
                                    1,
                                  )) *
                                  100,
                                8,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      Product sales will appear after orders are placed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-lg shadow-sm">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconAlertTriangle className="size-5 text-amber-600" />
                  Restock Activity
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest automated inventory checks
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/restock-products">
                  Manage
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {recentRestocks.length ? (
                  recentRestocks.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">#{request.id.slice(-8)}</p>
                        <Badge variant="outline" className="capitalize">
                          {request.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="mt-3 line-clamp-1 text-sm text-muted-foreground">
                        {request.products || "Multiple products"}
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {number.format(request.quantity)} units requested
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No restock requests yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default AdminOverview;
