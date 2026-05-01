"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconUsers,
  IconPackage,
  IconChartBar,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: IconShoppingCart,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: IconPackage,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: IconUsers,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: IconChartBar,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="lg:w-72 lg:flex-col lg:fixed lg:inset-y-10.25 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-6">
          <nav className="flex flex-col gap-1">
            {sidebarNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="mt-auto border-t p-4">
          <Separator className="mb-4" />

          {/* User Info at Bottom */}
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="size-9">
              <AvatarImage src="https://res.cloudinary.com/dqh5dajig/image/upload/v1777525265/4eb2ad02c9358d515cfa9a8cc6eb52dc_orubcs.jpg" />
              <AvatarFallback>NJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Nazmul Jahan</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <Button variant="ghost" size="icon" className="size-8">
              <IconLogout className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
