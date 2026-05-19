"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const number = new Intl.NumberFormat("en-US");

export function BarChart({
  data,
  valuePrefix = "",
}: {
  data: { label: string; value: number; orders: number }[];
  valuePrefix?: string;
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const totalOrders = data.reduce((total, item) => total + item.orders, 0);
  const totalValue = data.reduce((total, item) => total + item.value, 0);

  return (
    <TooltipProvider delayDuration={120}>
      <div className="w-full overflow-x-auto pb-1">
        <div className="relative flex h-72 min-w-110 items-end gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 pb-3 pt-6 sm:gap-3 sm:px-4">
          <div className="pointer-events-none absolute inset-x-4 top-6 h-px bg-border/70" />
          <div className="pointer-events-none absolute inset-x-4 top-1/3 h-px bg-border/40" />
          <div className="pointer-events-none absolute inset-x-4 top-2/3 h-px bg-border/40" />

          {data.map((item, index) => {
            const height = Math.max(
              (item.value / maxValue) * 100,
              item.value ? 12 : 4,
            );
            const valueShare = totalValue ? (item.value / totalValue) * 100 : 0;
            const orderLabel = item.orders === 1 ? "order" : "orders";

            return (
              <div
                key={item.label}
                className="relative z-10 flex min-w-12 flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-52 w-full items-end rounded-md bg-background/80 px-1.5 py-1.5 shadow-inner ring-1 ring-border/60">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`${item.label}: ${valuePrefix}${number.format(item.value)} from ${item.orders} ${orderLabel}`}
                        className={cn(
                          "group relative w-full origin-bottom rounded-sm bg-primary/80",
                          "shadow-sm shadow-primary/20 outline-none transition-all duration-300",
                          "animate-in fade-in-0 slide-in-from-bottom-3 zoom-in-95",
                          "hover:bg-primary hover:shadow-lg hover:shadow-primary/25",
                          "focus-visible:ring-3 focus-visible:ring-ring/30",
                        )}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 70}ms`,
                          animationDuration: "650ms",
                        }}
                      >
                        <span className="absolute inset-x-0 top-0 h-1 rounded-t-sm bg-primary-foreground/35 opacity-70 transition-opacity group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={10}
                      className="min-w-44 rounded-lg px-3 py-2 text-left shadow-xl"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-5">
                          <p className="font-medium">{item.label}</p>
                          <span className="rounded-full bg-background/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            Daily
                          </span>
                        </div>
                        <p className="text-sm font-semibold">
                          {valuePrefix}
                          {number.format(item.value)}
                        </p>
                        <div className="flex items-center justify-between gap-4 text-[11px] opacity-80">
                          <span>
                            {number.format(item.orders)} {orderLabel}
                          </span>
                          <span>{Math.round(valueShare)}% of total</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {valuePrefix}
                    {number.format(item.value)}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pointer-events-none absolute right-4 top-2 hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
            <span>
              {valuePrefix}
              {number.format(totalValue)}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>
              {number.format(totalOrders)}{" "}
              {totalOrders === 1 ? "order" : "orders"}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
