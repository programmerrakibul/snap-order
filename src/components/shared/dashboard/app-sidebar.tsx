"use client";

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
import ProfileDropdown from "@/components/shared/profile-dropdown";
import { sidebarItems } from "@/lib/constants";
import useUserData from "@/hooks/useUserData";
import { Role } from "@/generated/prisma/enums";
import { IconLoader } from "@tabler/icons-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, loading } = useUserData();

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
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="flex items-center font-semibold text-lg text-primary">
              <IconLoader className="animate-spin mr-2 size-7" />
              <span>Loading...</span>
            </span>
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  if (item.adminOnly && user?.role !== Role.ADMIN) return null;

                  return (
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
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <ProfileDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
