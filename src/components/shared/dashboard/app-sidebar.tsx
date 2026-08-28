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

import ProfileDropdown from "@/components/shared/profile-dropdown";
import Logo from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/generated/prisma/enums";
import useUserData from "@/hooks/useUserData";
import { sidebarItems } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
              <Logo to="/" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {loading ? (
                <>
                  {[...Array.from({ length: 8 })].map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton disabled>
                        <Skeleton className="size-5 rounded bg-muted-foreground/20" />
                        <Skeleton
                          className={"w-full h-7 bg-muted-foreground/20"}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              ) : (
                sidebarItems.map((item) => {
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
                })
              )}
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
