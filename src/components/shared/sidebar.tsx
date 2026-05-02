"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconUsers,
  IconPackage,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: IconShoppingCart },
  { title: "Products", href: "/dashboard/products", icon: IconPackage },
  { title: "Customers", href: "/dashboard/customers", icon: IconUsers },
  { title: "Analytics", href: "/dashboard/analytics", icon: IconChartBar },
  { title: "Settings", href: "/dashboard/settings", icon: IconSettings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "lg:flex lg:flex-col lg:inset-y-0 border-r bg-card transition-all duration-300",
          collapsed ? "lg:w-24" : "lg:w-72",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold text-xl">SO</span>
              </div>
              {!collapsed && (
                <span className="font-semibold text-xl tracking-tight">
                  SnapOrder
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="size-8"
            >
              {collapsed ? (
                <IconChevronRight className="size-4" />
              ) : (
                <IconChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-6">
            <nav className="flex flex-col gap-1">
              {sidebarNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Tooltip key={item.href} disableHoverableContent={!collapsed}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent",
                          collapsed ? "justify-center" : "",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="size-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="text-sm">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}
