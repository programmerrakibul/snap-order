"use client";

import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconUsers,
  IconUserCircle,
  IconPackageImport,
  IconPackages,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import ProfileDropdown from "../profile-dropdown";

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: IconLayoutDashboard },
  {
    title: "Add Product",
    href: "/dashboard/add-products",
    icon: IconPackageImport,
  },
  { title: "Products", href: "/dashboard/products", icon: IconPackages },
  { title: "Orders", href: "/dashboard/orders", icon: IconShoppingCart },
  { title: "Customers", href: "/dashboard/customers", icon: IconUsers },
  { title: "Profile", href: "/dashboard/profile", icon: IconUserCircle },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Logo to="/dashboard" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                    onClick={() => isMobile && toggleSidebar()}
                    title={item.title}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <Link href={item.href}>
                      {<item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ProfileDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
